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

        // Populate each bookmark with its website
        const bookmarksWithWebsites = await Promise.all(
            bookmarks.map(async (bookmark) => {
                const website = bookmark.websiteId ? await ctx.db.get(bookmark.websiteId) : null;
                return {
                    ...bookmark,
                    website,
                };
            }),
        );

        return {
            folders,
            bookmarks: bookmarksWithWebsites,
        };
    },
});

export const saveWebsiteSuggestionAsBookmark = zMutation({
    args: {
        websiteSuggestion: WebsiteSuggestionSchema,
        selectedFolderPath: z.optional(z.array(z.string())),
        selectedFolderColor: z.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const bookmarkFolderPath = args.selectedFolderPath ?? args.websiteSuggestion.suggestedFolderPath;
        if (!identity) throw new Error('Not authenticated');

        const userId = identity.subject;

        // 🗂 Upsert folder path and get final folder ID
        const folderId = bookmarkFolderPath
            ? await getOrCreateFolderPath(ctx, userId, bookmarkFolderPath, args.selectedFolderColor)
            : undefined;

        // 🌐 Upsert website
        const existingWebsite = await ctx.db
            .query('websites')
            .withIndex('by_url', (q) => q.eq('url', args.websiteSuggestion.url))
            .unique();

        const existingBookmark = await ctx.db
            .query('bookmarks')
            .withIndex('by_websiteId', (q) => q.eq('websiteId', existingWebsite?._id))
            .first();

        if (existingBookmark)
            return await ctx.db.patch(existingBookmark._id, {
                folderId,
            });

        const websiteId = existingWebsite
            ? existingWebsite._id
            : await ctx.db.insert('websites', {
                  url: args.websiteSuggestion.url,
                  name: args.websiteSuggestion.title,
                  description: args.websiteSuggestion.description,
                  upvotes: [],
                  downvotes: [],
                  ratings: [],
                  videosOfWebsite: args.websiteSuggestion.videosOfWebsite ?? [],
                  tags: args.websiteSuggestion.tags ?? [],
              });

        await ctx.db.insert('bookmarks', {
            userId,
            websiteId,
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

        // Populate each bookmark with its website
        const bookmarksWithWebsites = await Promise.all(
            bookmarks.map(async (bookmark) => {
                const website = bookmark.websiteId ? await ctx.db.get(bookmark.websiteId) : null;
                return {
                    ...bookmark,
                    website,
                };
            }),
        );

        return {
            folder,
            subfolders,
            bookmarks: bookmarksWithWebsites,
        };
    },
});
