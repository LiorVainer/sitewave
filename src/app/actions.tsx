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

  void handleWebsiteSuggestionStreaming(prompt, amount, stream);

  return stream.value;
}

async function findVideosForTitle(title: string): Promise<{ title: string; url: string }[]> {
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
    output: 'array', // ensures partialObjectStream: AsyncIterable<WebsiteSuggestion[]>
    schema: WebsiteSuggestionSchema,
    prompt: `Generate ${amount} Website suggestions based on the following context: ${prompt}`,
  });

  for await (const partials of partialObjectStream) {
    const newEnriched: WebsiteSuggestion[] = [];

    for (const vs of partials) {
      if (!seen.has(vs.title)) {
        seen.add(vs.title);

        // const vids = await findVideosForTitle(vs.title);
        // newEnriched.push({ ...vs, videosOfWebsite: vids });
        newEnriched.push({ ...vs });
      }
    }

    if (newEnriched.length > 0) {
      // Stream just the new enriched entries
      stream.update(newEnriched);
    }
  }

  stream.done();
}
