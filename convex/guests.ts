import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const createNewGuest = mutation({
    args: {
        sessionId: v.string(),
    },
    handler: async (ctx, { sessionId }) => {
        // Check if guest already exists with this sessionId
        const existingGuest = await ctx.db
            .query('guests')
            .withIndex('by_sessionId', (q) => q.eq('sessionId', sessionId))
            .first();

        if (existingGuest) {
            return existingGuest._id;
        }

        // Create new guest
        const guestId = await ctx.db.insert('guests', {
            sessionId,
        });

        return guestId;
    },
});

export const getGuestBySessionId = query({
    args: { sessionId: v.string() },
    handler: async (ctx, { sessionId }) => {
        const guest = await ctx.db
            .query('guests')
            .withIndex('by_sessionId', (q) => q.eq('sessionId', sessionId))
            .first();

        return guest;
    },
});
