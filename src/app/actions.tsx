'use server';

import { createStreamableValue } from 'ai/rsc';
import { GlobalConfig } from '@/ai/ai.const';
import { WebsiteSuggestion, WebsiteSuggestionSchema } from '@/models/website-suggestion.model';
import { streamObject } from 'ai';
import { google } from 'googleapis';
import { ENV } from '@/env/env.config';

const youtube = google.youtube({
    version: 'v3',
    auth: ENV?.YOUTUBE_API_KEY,
});

export async function suggestWebsites(prompt: string, amount: number) {
    'use server';

    const stream = createStreamableValue<WebsiteSuggestion[]>();

    await handleWebsiteSuggestionStreaming(prompt, amount, stream);

    return stream.value;
}

async function findVideosForTitle(title: string): Promise<{ title: string; url: string }[]> {
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
}

async function handleWebsiteSuggestionStreaming(
    prompt: string,
    amount: number,
    stream: ReturnType<typeof createStreamableValue<WebsiteSuggestion[]>>,
) {
    const seen = new Set<string>(); // track processed titles
    const results: WebsiteSuggestion[] = [];

    const { partialObjectStream } = streamObject({
        model: GlobalConfig.model,
        output: 'array',
        schema: WebsiteSuggestionSchema,
        prompt: `Generate ${amount} Website suggestions based on the following context: ${prompt}`,
    });

    for await (const partials of partialObjectStream) {
        for (const partial of partials) {
            const vs = partial as WebsiteSuggestion;

            if (!seen.has(vs.title)) {
                seen.add(vs.title);

                const vids = await findVideosForTitle(vs.title);

                console.log({ vids, vs });
                results.push({
                    ...vs,
                    videosOfWebsite: vids,
                });
            }
        }

        console.log(`Streamed ${results.length} unique website suggestions so far...`);

        // Stream the full up-to-date list, enriched only for new items
        stream.update(results);
    }

    stream.done();
}
