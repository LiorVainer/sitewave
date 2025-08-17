import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import usageTables from './usage_tracking/tables.js';

export default defineSchema({
    ...usageTables,
    websites: defineTable({
        url: v.string(),
        name: v.string(),
        description: v.string(),

        upvotes: v.array(v.string()), // userIds
        downvotes: v.array(v.string()),

        ratings: v.array(
            v.object({
                userId: v.string(),
                rating: v.number(), // 1–5 scale (your choice)
                comment: v.optional(v.string()),
            }),
        ),
        videosOfWebsite: v.optional(
            v.array(
                v.object({
                    title: v.string(),
                    url: v.string(),
                }),
            ),
        ),
        tags: v.optional(v.array(v.string())),
    }).index('by_url', ['url']),

    folders: defineTable({
        userId: v.string(),
        name: v.string(),
        color: v.string(),
        parentFolderId: v.optional(v.id('folders')),
    })
        .index('by_userId', ['userId'])
        .index('by_userId_name_parentFolderId', ['userId', 'name', 'parentFolderId'])
        .index('by_parentFolder', ['parentFolderId']),

    bookmarks: defineTable({
        userId: v.string(),
        websiteId: v.optional(v.id('websites')), // ✅ Reference to websites table
        folderId: v.optional(v.id('folders')),
    })
        .index('by_userId', ['userId'])
        .index('by_folderId', ['folderId'])
        .index('by_websiteId', ['websiteId']),

    guests: defineTable({
        sessionId: v.string(),
    }).index('by_sessionId', ['sessionId']),

    websiteComparisons: defineTable({
        threadId: v.string(),
        columns: v.array(v.any()), // Use v.any() for columns/rows, or define a stricter schema if desired
        rows: v.array(v.any()),
        // Convex will add _creationTime and _id automatically
    }).index('by_threadId', ['threadId']),
});
