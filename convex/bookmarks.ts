import { query } from './_generated/server';

import { getOrCreateFolderPath } from './helpers/folder.helpers';
import { zMutation } from './helpers/zod.helpers';
import { WebsiteSuggestionSchema } from '../src/models/website-suggestion.model';
import { FolderNode } from '../src/types/folder.types';

export const getUserFoldersWithBookmarks = query({
    args: {},
    handler: async (ctx): Promise<FolderNode[]> => {
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

        const bookmarksByFolderId = new Map<string, FolderNode['bookmarks']>();
        for (const bookmark of bookmarks) {
            const key = bookmark.folderId?.toString() ?? '';
            const simplified = {
                _id: bookmark._id,
                title: bookmark.title,
                url: bookmark.url,
                createdAt: bookmark._creationTime,
            };
            if (!bookmarksByFolderId.has(key)) bookmarksByFolderId.set(key, []);
            bookmarksByFolderId.get(key)!.push(simplified);
        }

        const folderMap = new Map<string, FolderNode>();
        for (const folder of folders) {
            folderMap.set(folder._id.toString(), {
                _id: folder._id,
                name: folder.name,
                parentFolderId: folder.parentFolderId,
                createdAt: folder._creationTime,
                children: [],
                bookmarks: bookmarksByFolderId.get(folder._id.toString()) || [],
            });
        }

        const rootFolders: FolderNode[] = [];

        for (const folder of folderMap.values()) {
            if (folder.parentFolderId) {
                const parent = folderMap.get(folder.parentFolderId.toString());
                if (parent) {
                    parent.children.push(folder);
                }
            } else {
                rootFolders.push(folder);
            }
        }

        return rootFolders;
    },
});

export const saveWebsiteSuggestionAsBookmark = zMutation({
    args: {
        websiteSuggestion: WebsiteSuggestionSchema,
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Not authenticated');

        const userId = identity.subject;

        // 🗂 Upsert folder path and get final folder ID
        const folderId = args.websiteSuggestion.suggestedFolderPath
            ? await getOrCreateFolderPath(ctx, userId, args.websiteSuggestion.suggestedFolderPath)
            : undefined;

        // 🧠 Optional: Check if bookmark exists and skip or update

        await ctx.db.insert('bookmarks', {
            userId,
            title: args.websiteSuggestion.title,
            url: args.websiteSuggestion.url,
            folderId,
        });
    },
});
