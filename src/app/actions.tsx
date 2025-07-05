'use server';

import { createStreamableValue } from 'ai/rsc';
import { GlobalConfig } from '@/ai/ai.const';
import { WebsiteSuggestion, WebsiteSuggestionSchema } from '@/models/website-suggestion.model';
import { streamObject } from 'ai';
import { youtubeService } from '@/services/youtube';

export async function suggestWebsites(prompt: string, amount: number) {
  'use server';

  const stream = createStreamableValue<WebsiteSuggestion[]>();

  void handleWebsiteSuggestionStreaming(prompt, amount, stream);

  return stream.value;
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

        const vids = await youtubeService.findVideosForTitle(vs.title);
        newEnriched.push({ ...vs, videosOfWebsite: vids });
      }
    }

    if (newEnriched.length > 0) {
      // Stream just the new enriched entries
      stream.update(newEnriched);
    }
  }

  stream.done();
}
