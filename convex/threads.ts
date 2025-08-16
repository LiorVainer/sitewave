import { components, internal } from './_generated/api';
import { v } from 'convex/values';
import { ActionCtx, mutation, MutationCtx, query, QueryCtx } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';
import { createThread, getThreadMetadata, listMessages, syncStreams, vStreamArgs } from '@convex-dev/agent';

// Create new thread with initial prompt - this replaces the server action
export const createNewThread = mutation({
    args: {
        initialMessage: v.string(), // This is the prompt from UI
        title: v.optional(v.string()),
    },
    handler: async (ctx, { initialMessage, title }) => {
        // Create thread with the initial message (prompt)
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Not authenticated');

        const threadId = await createThread(ctx, components.agent, {
            // userId: await getAuthUserId(ctx), // Uncomment when auth is set up
            title: title || 'Website Suggestions',
            userId: identity.subject,
        });

        // Schedule the async action to generate website suggestions
        await ctx.scheduler.runAfter(0, internal.websiteSuggestions.generateSuggestions, {
            threadId,
            prompt: initialMessage,
            amount: 5, // Default amount
            existingUrls: [], // Empty for new thread
        });

        return threadId;
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

// Helper function for authorization when needed
export async function authorizeThreadAccess(ctx: QueryCtx | MutationCtx | ActionCtx, threadId: string) {
    // For now, allow access to all threads
    // In production, you'd implement proper user authorization here
    const metadata = await getThreadMetadata(ctx, components.agent, { threadId });
    return metadata;
}

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
