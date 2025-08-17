// convex/websites.ts
// convex/websites.ts
import { action, mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { websiteAgent } from './agents/websiteAgent';
import { usageHandler } from './usage_tracking/usageHandler';
import { internal } from './_generated/api';
import { generateZodSchemaFromColumns } from './lib/zod.utils';
import { WebsiteComparisonColumnsSchema } from '../src/models/website-comparison.model';

export const getWebsiteByUrl = query({
    args: { url: v.string() },
    handler: async (ctx, { url }) => {
        return await ctx.db
            .query('websites')
            .withIndex('by_url', (q) => q.eq('url', url))
            .first();
    },
});

export const addWebsiteIfNotExists = mutation({
    args: {
        url: v.string(),
        name: v.string(),
        description: v.string(),
    },
    handler: async (ctx, { url, name, description }) => {
        const existing = await ctx.db
            .query('websites')
            .withIndex('by_url', (q) => q.eq('url', url))
            .first();

        if (existing) return existing;

        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const newWebsite = {
            url,
            name: name ?? 'Unknown',
            description,
            upvotes: [],
            downvotes: [],
            ratings: [],
        };

        const id = await ctx.db.insert('websites', newWebsite);
        const createdWebsite = await ctx.db.get(id);

        return { ...createdWebsite, _id: id };
    },
});

export const voteOnWebsite = mutation({
    args: {
        websiteId: v.id('websites'),
        vote: v.union(v.literal('up'), v.literal('down')),
    },
    handler: async (ctx, { websiteId, vote }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Not authenticated');

        const userId = identity.subject;

        const website = await ctx.db.get(websiteId);
        if (!website) throw new Error('Website not found');

        const alreadyUp = website.upvotes.includes(userId);
        const alreadyDown = website.downvotes.includes(userId);

        const updated = {
            upvotes: website.upvotes.filter((id) => id !== userId),
            downvotes: website.downvotes.filter((id) => id !== userId),
        };

        if (vote === 'up' && !alreadyUp) updated.upvotes.push(userId);
        if (vote === 'down' && !alreadyDown) updated.downvotes.push(userId);

        await ctx.db.patch(websiteId, updated);
    },
});

export const rateWebsite = mutation({
    args: {
        websiteId: v.id('websites'),
        rating: v.number(),
        comment: v.optional(v.string()),
    },
    handler: async (ctx, { websiteId, rating, comment }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Not authenticated');

        const userId = identity.subject;

        const website = await ctx.db.get(websiteId);
        if (!website) throw new Error('Website not found');

        const newRatings = website.ratings.filter((r) => r.userId !== userId);
        newRatings.push({ userId, rating, comment });

        await ctx.db.patch(websiteId, { ratings: newRatings });
    },
});

export const generateWebsiteComparison = action({
    args: {
        threadId: v.string(),
        websites: v.array(v.any()),
        guestId: v.optional(v.id('guests')),
    },
    handler: async (ctx, { threadId, websites }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Not authenticated');

        const userId = identity.subject;

        const columnsPrompt = `Given the following websites, generate a list of relevant comparison columns. Each column should have:
- id (snake_case),
- header (UI display label),
- accessorKey (same as id).

Always Dont Include the following columns:
1. "url" - the website URL
2. "title" - the website title
3. "description" - a brief description of the website

They are not relevant for comparison.

Websites:
${websites.map((w, i) => `${i + 1}. ${w.title} (${w.url})`).join('\n')}
`;
        const columnsResult = await websiteAgent.generateObject(
            ctx,
            { usageHandler, userId },
            {
                prompt: columnsPrompt,
                schema: WebsiteComparisonColumnsSchema,
                mode: 'json',
                output: 'array',
            },
        );

        const columns = columnsResult.object.flat();
        const dynamicSchema = generateZodSchemaFromColumns(columns);

        // Use the agent to generate rows
        const rowsPrompt = `You are generating a structured website comparison table.\n\nWebsites:\n${websites.map((w, i) => `${i + 1}. ${w.title} (${w.url})`).join('\n')}\n`;
        const rowsResult = await websiteAgent.generateObject(
            ctx,
            { usageHandler, userId },
            {
                prompt: rowsPrompt,
                schema: dynamicSchema.array(),
                mode: 'json',
                output: 'array',
            },
        );

        const rows = rowsResult.object.flat();

        if (!Array.isArray(columns) || !Array.isArray(rows)) {
            throw new TypeError('Invalid response format from website agent');
        }

        await ctx.runMutation(internal.websiteSuggestions.createOrUpdateWebsiteComparison, {
            columns,
            rows,
            threadId,
        });

        return {
            columns,
            rows,
        };
    },
});
