import { action, internalAction, internalMutation, query } from './_generated/server';
import { components, internal } from './_generated/api';
import { v } from 'convex/values';
import { websiteAgent } from './agents/websiteAgent';
import { listMessages, saveMessage } from '@convex-dev/agent';
import { z } from 'zod';
import { WebsiteSuggestionSchema } from '../src/models/website-suggestion.model';

export const loadMoreSuggestions = action({
    args: {
        threadId: v.string(),
        amount: v.number(),
        existingUrls: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.runAction(internal.websiteSuggestions.generateSuggestionsInternal, args);

        return 1;
    },
});

export const generateSuggestions = action({
    args: {
        threadId: v.string(),
        amount: v.number(),
        prompt: v.optional(v.string()),
        existingUrls: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.runAction(internal.websiteSuggestions.generateSuggestionsInternal, args);

        return 1;
    },
});

// Generate website suggestions with optional prompt message creation
export const generateSuggestionsInternal = internalAction({
    args: {
        threadId: v.string(),
        prompt: v.optional(v.string()),
        amount: v.number(),
        existingUrls: v.array(v.string()),
    },
    handler: async (ctx, { threadId, prompt, amount, existingUrls }) => {
        // Continue the thread
        const { thread } = await websiteAgent.continueThread(ctx, { threadId });

        try {
            const savePromptResult = prompt
                ? await saveMessage(ctx, components.agent, {
                      threadId,
                      prompt,
                  })
                : undefined;

            const firstThreadMessageQueryResult = await listMessages(ctx, components.agent, {
                threadId,
                paginationOpts: { numItems: 1, cursor: null },
            });

            const firstThreadObject = firstThreadMessageQueryResult.page.at(0);
            const firstThreadMessage = firstThreadObject ? firstThreadObject.message : null;
            const firstThreadMessageId = firstThreadObject?._id;

            // Create the generation prompt for all suggestions at once
            const generationPrompt = `Generate ${amount} website suggestions based on the following context: ${prompt ?? firstThreadMessage ?? 'No prompt provided'} 
            Do not include any of these URLs: ${existingUrls.join(', ')}.
            
            For each website suggestion, provide:
            - title: The name of the website
            - url: The complete URL
            - description: A brief description of what the site offers
            - tags: Relevant categories/tags (as an array)
            - suggestedFolderPath: An array of folder names where this should be categorized
            
            Make sure all websites are real, accessible, and relevant to the user's request.
            Return an array of ${amount} website suggestion objects.`;

            // Generate all website suggestions at once
            const result = await thread.generateObject({
                prompt: generationPrompt,
                schema: z.array(WebsiteSuggestionSchema),
                mode: 'json',
                output: 'array',
                promptMessageId: savePromptResult?.messageId ?? firstThreadMessageId, // Associate with the prompt message
            });

            const suggestions = result.object.flat();
            console.log(`Generated ${suggestions.length} suggestions for thread ${threadId}`);

            // Process suggestions sequentially to avoid race conditions with saveMessage
            for (let index = 0; index < suggestions.length; index++) {
                const suggestion = suggestions[index];
                try {
                    console.log(`Processing suggestion ${index + 1}/${suggestions.length}: ${suggestion.title}`);

                    // Enrich with YouTube videos
                    let enrichedSuggestion = suggestion;
                    try {
                        const videos = await ctx.runAction(internal.youtube.fetchYouTubeVideos, {
                            title: suggestion.title,
                        });

                        enrichedSuggestion = {
                            ...suggestion,
                            videosOfWebsite: videos,
                        };

                        console.log(`Enriched ${suggestion.title} with ${videos.length} videos`);
                    } catch (videoError) {
                        console.warn(`Failed to fetch videos for ${suggestion.title}:`, videoError);
                        // Continue with suggestion without videos
                    }

                    // Save the enriched suggestion as a message
                    await saveMessage(ctx, components.agent, {
                        threadId,
                        message: {
                            role: 'assistant',
                            content: JSON.stringify(enrichedSuggestion),
                        },
                    });

                    console.log(`Saved suggestion ${index + 1}/${suggestions.length}: ${suggestion.title}`);
                } catch (error) {
                    console.error(`Failed to process suggestion ${index + 1} (${suggestion.title}):`, error);

                    // Save error message for this specific suggestion
                    await saveMessage(ctx, components.agent, {
                        threadId,
                        message: {
                            role: 'assistant',
                            content: `Failed to process suggestion "${suggestion.title}": ${JSON.stringify(error)}`,
                        },
                    });
                }
            }

            console.log(`Completed processing all ${suggestions.length} suggestions for thread ${threadId}`);
            return { threadId, generatedCount: suggestions.length };
        } catch (error) {
            console.error(`Failed to generate suggestions for thread ${threadId}:`, error);

            // Save overall error message
            await saveMessage(ctx, components.agent, {
                threadId,
                message: {
                    role: 'assistant',
                    content: `Failed to generate website suggestions: ${JSON.stringify(error)}`,
                },
            });

            throw error;
        }
    },
});

export const createOrUpdateWebsiteComparison = internalMutation({
    args: {
        threadId: v.string(),
        columns: v.array(v.any()),
        rows: v.array(v.any()),
    },
    handler: async (ctx, { threadId, columns, rows }) => {
        // Upsert: if exists, update; else, create
        const existing = await ctx.db
            .query('websiteComparisons')
            .withIndex('by_threadId', (q) => q.eq('threadId', threadId))
            .first();
        if (existing) {
            await ctx.db.patch(existing._id, { columns, rows });
            return existing._id;
        } else {
            return await ctx.db.insert('websiteComparisons', { threadId, columns, rows });
        }
    },
});

export const getWebsiteComparisonByThread = query({
    args: { threadId: v.string() },
    handler: async (ctx, { threadId }) => {
        const comparison = await ctx.db
            .query('websiteComparisons')
            .withIndex('by_threadId', (q) => q.eq('threadId', threadId))
            .first();
        return comparison ? { columns: comparison.columns, rows: comparison.rows } : null;
    },
});
