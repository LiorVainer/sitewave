import { components, internal } from './_generated/api';
import { v } from 'convex/values';
import { action, ActionCtx, internalAction, mutation, MutationCtx, query, QueryCtx } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';
import { createThread, getThreadMetadata, listMessages, syncStreams, vStreamArgs } from '@convex-dev/agent';
import { websiteAgent } from './agents/websiteAgent';
import z from 'zod';

// Create new thread with initial prompt - this replaces the server action
export const createNewThread = mutation({
    args: {
        initialMessage: v.string(),
        title: v.optional(v.string()),
    },
    handler: async (ctx, { initialMessage, title }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Not authenticated');

        const threadId = await createThread(ctx, components.agent, {
            title: title || 'Website Suggestions',
            userId: identity.subject,
        });

        await ctx.scheduler.runAfter(0, internal.websiteSuggestions.generateSuggestions, {
            threadId,
            prompt: initialMessage,
            amount: 5,
            existingUrls: [],
        });

        await ctx.scheduler.runAfter(1000 * 5, internal.threads.updateThreadTitle, { threadId });

        return threadId;
    },
});

export const updateThreadTitle = internalAction({
    args: { threadId: v.string() },
    handler: async (ctx, { threadId }) => {
        await authorizeThreadAccess(ctx, threadId);
        const { thread } = await websiteAgent.continueThread(ctx, { threadId });
        const {
            object: { title, summary },
        } = await thread.generateObject(
            {
                mode: 'json',
                schemaDescription:
                    "Generate a title and summary for the thread. The title should be a single sentence that captures the main topic of the thread. The summary should be a short description of the thread that could be used to describe it to someone who hasn't read it.",
                schema: z.object({
                    title: z.string().describe('The new title for the thread'),
                    summary: z.string().describe('The new summary for the thread'),
                }),
                prompt: 'Generate a title and summary for this thread.',
            },
            { storageOptions: { saveMessages: 'none' } },
        );
        await thread.updateMetadata({ title, summary });
    },
});

export const listThreads = query({
    args: {
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Not authenticated');
        const threads = await ctx.runQuery(components.agent.threads.listThreadsByUserId, {
            paginationOpts: args.paginationOpts,
            userId: identity.subject,
        });

        // Add formatted creation date and other metadata
        const threadsWithMetadata = await Promise.all(
            threads.page.map(async (thread) => {
                const metadata = await getThreadMetadata(ctx, components.agent, {
                    threadId: thread._id,
                });

                return {
                    ...thread,
                    title: metadata.title || 'Untitled Thread',
                    summary: metadata.summary,
                    creationDate: new Date(thread._creationTime).toLocaleDateString(),
                    creationTime: thread._creationTime,
                };
            }),
        );

        return {
            ...threads,
            page: threadsWithMetadata,
        };
    },
});

export const getThreadDetails = query({
    args: { threadId: v.string() },
    handler: async (ctx, { threadId }) => {
        const metadata = await getThreadMetadata(ctx, components.agent, {
            threadId,
        });
        return {
            threadId,
            title: metadata.title || 'Untitled Thread',
            summary: metadata.summary,
        };
    },
});

export const deleteThread = action({
    args: { threadId: v.string() },
    handler: async (ctx, { threadId }) => {
        await authorizeThreadAccess(ctx, threadId, true);
        await websiteAgent.deleteThreadSync(ctx, { threadId });
    },
});

export const listThreadMessages = query({
    args: {
        threadId: v.string(),
        paginationOpts: paginationOptsValidator,
        streamArgs: vStreamArgs,
    },
    handler: async (ctx, { threadId, paginationOpts, streamArgs }) => {
        // Get paginated messages
        const paginated = await listMessages(ctx, components.agent, {
            threadId,
            paginationOpts,
        });

        // Get streaming deltas
        const streams = await syncStreams(ctx, components.agent, {
            threadId,
            streamArgs,
        });

        console.log(`Loaded ${paginated.page.length} messages for thread ${threadId}`);

        return { ...paginated, streams };
    },
});

export async function authorizeThreadAccess(
    ctx: QueryCtx | MutationCtx | ActionCtx,
    threadId: string,
    requireUser?: boolean,
) {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity ? identity.subject : null;

    if (requireUser && !userId) {
        throw new Error('Unauthorized: user is required');
    }
    const { userId: threadUserId } = await getThreadMetadata(ctx, components.agent, { threadId });
    if (requireUser && threadUserId !== userId) {
        throw new Error('Unauthorized: user does not match thread user');
    }
}
