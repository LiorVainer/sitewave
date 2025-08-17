import { internalAction } from './_generated/server';
import { v } from 'convex/values';

export const fetchYouTubeVideos = internalAction({
    args: { title: v.string() },
    handler: async (ctx, { title }): Promise<{ title: string; url: string }[]> => {
        try {
            // Get YouTube API key from environment
            const apiKey = process.env.YOUTUBE_API_KEY;

            if (!apiKey) {
                console.warn('YouTube API key not found, returning empty array');
                return [];
            }

            // Call YouTube Data API v3
            const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(title)}&type=video&maxResults=3&key=${apiKey}`;

            const response = await fetch(searchUrl);

            if (!response.ok) {
                throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.items || data.items.length === 0) {
                return [];
            }

            // Transform YouTube API response to our format
            const videos = data.items.map((item: any) => ({
                title: item.snippet.title || '',
                url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            }));

            console.log(`Found ${videos.length} YouTube videos for "${title}"`);
            return videos;
        } catch (error) {
            console.error('Failed to fetch YouTube videos:', error);
            return [];
        }
    },
});
