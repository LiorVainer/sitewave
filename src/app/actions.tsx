'use server';

import { createStreamableValue } from 'ai/rsc';
import { GlobalConfig } from '@/ai/ai.const';
import { WebsiteSuggestion, WebsiteSuggestionSchema } from '@/models/website-suggestion.model';
import { streamObject } from 'ai';
import { youtubeService } from '@/services/youtube';

export async function suggestWebsites(prompt: string, amount: number, existingUrls: string[] = []) {
    'use server';

    const stream = createStreamableValue<WebsiteSuggestion>();

    void handleWebsiteSuggestionStreaming(prompt, amount, stream, existingUrls);

    return stream.value;
}

async function handleWebsiteSuggestionStreaming(
    prompt: string,
    amount: number,
    stream: ReturnType<typeof createStreamableValue<WebsiteSuggestion>>,
    existingUrls: string[] = [],
) {
    const seen = new Set<string>(existingUrls); // track processed titles, including existing

    const { partialObjectStream } = streamObject({
        model: GlobalConfig.model,
        output: 'array',
        schema: WebsiteSuggestionSchema,
        prompt: `Generate ${amount} Website suggestions based on the following context: ${prompt}. Do not include any of these titles: ${existingUrls.join(', ')}`,
    });

    for await (const partials of partialObjectStream) {
        for (const vs of partials) {
            if (!seen.has(vs.url)) {
                seen.add(vs.url);

                const vids = await youtubeService.findVideosForTitle(vs.title);
                stream.update({ ...vs, videosOfWebsite: vids });
            }
        }
    }

    stream.done();
}
