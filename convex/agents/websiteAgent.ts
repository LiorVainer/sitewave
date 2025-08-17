import { Agent, createTool } from '@convex-dev/agent';
import { components } from '../_generated/api';
import { google } from '@ai-sdk/google';
import { usageHandler } from '../usage_tracking/usageHandler';
import { z } from 'zod';

// Tool for YouTube video lookup
const findVideosForTitle = createTool({
    description: 'Find YouTube videos for a website title',
    args: z.object({ title: z.string() }),
    handler: async (ctx, { title }): Promise<{ title: string; url: string }[]> => {
        // Note: In production, you'd want to implement this using your YouTube API
        // For now, returning empty array as fallback
        try {
            // This would be implemented with your YouTube service
            // but since it's server-side, we'll need to handle it differently
            return [];
        } catch (error) {
            console.error(`Error fetching videos for title "${title}":`, error);
            return [];
        }
    },
});

// Define the website suggestion agent
export const websiteAgent = new Agent(components.agent, {
    name: 'Website Suggestion Agent',
    chat: google('gemini-2.0-flash-exp', {
        useSearchGrounding: true,
        dynamicRetrievalConfig: {
            mode: 'MODE_UNSPECIFIED',
        },
    }),
    tools: { findVideosForTitle },
    instructions: `You are a helpful assistant that suggests websites based on user prompts. 
  Generate website suggestions with complete information including title, URL, description, tags, and suggested folder paths.
  Always provide accurate, real websites that match the user's request.`,
    maxSteps: 3, // Allow tool calls
    usageHandler,
});
