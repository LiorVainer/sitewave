import { query } from './_generated/server';

import { getOrCreateFolderPath } from './helpers/folder.helpers';
import { zMutation } from './helpers/zod.helpers';
import { WebsiteSuggestionSchema } from '../src/models/website-suggestion.model';
import { v } from 'convex/values';
import z from 'zod';

export const getUserFoldersAndBookmarksFlat = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Not authenticated');

        const userId = identity.subject;

        const folders = await ctx.db
            .query('folders')
            .withIndex('by_userId', (q) => q.eq('userId', userId))
            .collect();

        const bookmarks = await ctx.db
            .query('bookmarks')
            .withIndex('by_userId', (q) => q.eq('userId', userId))
            .collect();

        return {
            folders: folders.map((f) => ({
                _id: f._id,
                name: f.name,
                parentFolderId: f.parentFolderId ?? null,
            })),
            bookmarks: bookmarks.map((b) => ({
                _id: b._id,
                title: b.title,
                url: b.url,
                folderId: b.folderId ?? null,
            })),
        };
    },
});

export const saveWebsiteSuggestionAsBookmark = zMutation({
    args: {
        websiteSuggestion: WebsiteSuggestionSchema,
        selectedFolderPath: z.optional(z.array(z.string())),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const bookmarkFolderPath = args.selectedFolderPath ?? args.websiteSuggestion.suggestedFolderPath;
        if (!identity) throw new Error('Not authenticated');

        const userId = identity.subject;

        // 🗂 Upsert folder path and get final folder ID
        const folderId = bookmarkFolderPath ? await getOrCreateFolderPath(ctx, userId, bookmarkFolderPath) : undefined;

        // 🧠 Optional: Check if bookmark exists and skip or update

        await ctx.db.insert('bookmarks', {
            userId,
            title: args.websiteSuggestion.title,
            url: args.websiteSuggestion.url,
            description: args.websiteSuggestion.description,
            videosOfWebsite: args.websiteSuggestion.videosOfWebsite,
            folderId,
        });
    },
});

export const getFolderContents = query({
    args: { folderId: v.id('folders') },
    handler: async (ctx, { folderId }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Not authenticated');

        const folder = await ctx.db.get(folderId);
        if (!folder || folder.userId !== identity.subject) return null;

        const subfolders = await ctx.db
            .query('folders')
            .withIndex('by_parentFolder', (q) => q.eq('parentFolderId', folderId))
            .collect();

        const bookmarks = await ctx.db
            .query('bookmarks')
            .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
            .filter((q) => q.eq(q.field('folderId'), folderId))
            .collect();

        return {
            folder,
            subfolders,
            bookmarks,
        };
    },
});
