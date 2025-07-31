import { streamObject } from 'ai';
import { GlobalConfig } from '@/ai/ai.const';
import { WebsiteSuggestion } from '@/models/website-suggestion.model';
import { WebsiteComparisonColumnsSchema } from '@/models/website-comparison.model'; // your OpenAI config or use openai('gpt-4')

export const maxDuration = 30;

type Payload = {
    websites: WebsiteSuggestion[];
};

export async function POST(req: Request) {
    const { websites }: Payload = await req.json();

    const result = streamObject({
        model: GlobalConfig.model,
        schema: WebsiteComparisonColumnsSchema,
        prompt: `Given the following websites, generate a list of relevant comparison columns. Each column should have:
- id (snake_case),
- header (UI display label),
- accessorKey (same as id).

Always Dont Include the following columns:
1. "url" - the website URL
2. "title" - the website title
3. "description" - a brief description of the website

They are not relevant for comparison.

Websites:
${websites.map((w, i) => `${i + 1}. ${w.title} (${w.url}`).join('\n')}

Return only an object with a "columns" array.`,
    });

    return result.toTextStreamResponse();
}
