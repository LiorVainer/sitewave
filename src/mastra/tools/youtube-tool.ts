import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { google } from 'googleapis';
import { ENV } from '@/env/env.config';

const youtube = google.youtube({
  version: 'v3',
  auth: ENV?.YOUTUBE_API_KEY,
});

export const youtubeTool = createTool({
  id: 'youtube-search',
  description: 'Search YouTube for videos matching a title and return up to 3 results.',
  inputSchema: z.object({
    title: z.string().describe('The title or topic to search for on YouTube'),
  }),
  outputSchema: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
    }),
  ),
  execute: async ({ context }) => {
    try {
      const res = await youtube.search.list({
        part: ['snippet'],
        q: context.title,
        type: ['video'],
        maxResults: 3,
      });
      const items = res.data.items ?? [];
      return items.map((i) => ({
        title: i.snippet?.title ?? '',
        url: `https://www.youtube.com/watch?v=${i.id?.videoId}`,
      }));
    } catch (error) {
      console.error(`Error fetching videos for title "${context.title}":`, error);
      return [];
    }
  },
});
