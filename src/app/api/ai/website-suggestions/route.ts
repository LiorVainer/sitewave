import { streamObject } from 'ai';
import { GlobalConfig } from '@/ai/ai.const';
import { WebsiteSuggestionSchema } from '@/models/website-suggestion.model';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

type Payload = {
    amount: number;
    prompt: string;
};

export async function POST(req: Request) {
    const { amount, prompt }: Payload = await req.json();

    console.log(`Generating ${amount} website suggestions with prompt: ${prompt}`);

    const result = streamObject({
        model: GlobalConfig.model,
        output: 'array',
        schema: WebsiteSuggestionSchema,
        prompt: `Generate ${amount} Website suggestions based on the following context: ${prompt}`,
    });

    return result.toTextStreamResponse();
}
