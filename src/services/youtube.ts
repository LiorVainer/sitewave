import { google } from 'googleapis';
import { ENV } from '@/env/env.config';

const youtube = google.youtube({
    version: 'v3',
    auth: ENV?.YOUTUBE_API_KEY,
});

class YoutubeService {
    findVideosForTitle = async (title: string): Promise<{ title: string; url: string }[]> => {
        try {
            const res = await youtube.search.list({
                part: ['snippet'],
                q: title,
                type: ['video'],
                maxResults: 3,
            });
            const items = res.data.items ?? [];
            return items.map((i) => ({
                title: i.snippet?.title ?? '',
                url: `https://www.youtube.com/watch?v=${i.id?.videoId}`,
            }));
        } catch (error) {
            console.error(`Error fetching videos for title "${title}":`, error);
            return [];
        }
    };
}

export const youtubeService = new YoutubeService();
