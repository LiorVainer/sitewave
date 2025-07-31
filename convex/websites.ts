// convex/websites.ts
// convex/websites.ts
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

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
