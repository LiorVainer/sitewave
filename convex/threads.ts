import { components, internal } from './_generated/api';
import { v } from 'convex/values';
import {
    action,
    ActionCtx,
    internalAction,
    internalQuery,
    mutation,
    MutationCtx,
    query,
    QueryCtx,
} from './_generated/server';
import { paginationOptsValidator } from 'convex/server';
import { createThread, getThreadMetadata, listMessages, syncStreams, vStreamArgs } from '@convex-dev/agent';
import { websiteAgent } from './agents/websiteAgent';
import z from 'zod';

// Create new thread with initial prompt - this replaces the server action
export const createNewThread = mutation({
    args: {
        title: v.optional(v.string()),
        guestId: v.optional(v.id('guests')),
    },
    handler: async (ctx, { title, guestId }) => {
        const identity = await ctx.auth.getUserIdentity();

        // Check if we have either authenticated user or guest
        if (!identity && !guestId) {
            throw new Error('Not authenticated and no guest ID provided');
        }

        const threadId = await createThread(ctx, components.agent, {
            title: title || 'Website Suggestions',
            userId: identity?.subject || guestId,
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
        guestId: v.optional(v.id('guests')),
    },
    handler: async (ctx, { guestId }) => {
        const identity = await ctx.auth.getUserIdentity();

        console.log({ guestId });

        // Must have either authenticated user or guestId
        if (!identity && !guestId) {
            throw new Error('Not authenticated and no guest ID provided');
        }

        const userId = identity?.subject || guestId;
        const threads = await ctx.runQuery(components.agent.threads.listThreadsByUserId, {
            userId,
        });

        console.log(`Loaded ${threads.page.length} threads for user ${userId}`);

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

        return threadsWithMetadata;
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

export const renameThread = action({
    args: {
        threadId: v.string(),
        newTitle: v.string(),
        guestId: v.optional(v.id('guests')),
    },
    handler: async (ctx, { threadId, newTitle, guestId }) => {
        await authorizeThreadAccess(ctx, threadId, true, guestId);

        // Update thread metadata with new title
        const { thread } = await websiteAgent.continueThread(ctx, { threadId });
        await thread.updateMetadata({ title: newTitle });

        return { success: true };
    },
});

export async function authorizeThreadAccess(
    ctx: QueryCtx | MutationCtx | ActionCtx,
    threadId: string,
    requireUser?: boolean,
    guestId?: string,
) {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity ? identity.subject : guestId;

    if (requireUser && !userId) {
        throw new Error('Unauthorized: user is required');
    }

    const { userId: threadUserId } = await getThreadMetadata(ctx, components.agent, { threadId });
    if (requireUser && threadUserId !== userId) {
        throw new Error('Unauthorized: user does not match thread user');
    }
}

export const getFirstMessage = internalQuery({
    args: { threadId: v.string() },
    handler: async (ctx, { threadId }) => {
        const paginated = await listMessages(ctx, components.agent, {
            threadId,
            excludeToolMessages: true,
            paginationOpts: { cursor: null, numItems: 1 },
        });
        const first = paginated.page.at(0) ?? null;

        return first;
    },
});
