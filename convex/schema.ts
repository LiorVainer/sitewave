import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    folders: defineTable({
        userId: v.string(),
        name: v.string(),
        parentFolderId: v.optional(v.id('folders')),
    })
        .index('by_userId', ['userId'])
        .index('by_userId_name_parentFolderId', ['userId', 'name', 'parentFolderId']),
    bookmarks: defineTable({
        userId: v.string(),
        title: v.string(),
        url: v.string(),
        folderId: v.optional(v.id('folders')),
    }).index('by_userId', ['userId']),
});
