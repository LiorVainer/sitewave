import { GlobalConfig } from '@/ai/ai.const';
import { WebsiteSuggestion } from '@/models/website-suggestion.model';
import { ComparisonColumn } from '@/models/website-comparison.model';
import { streamObject } from 'ai';
import { generateZodSchemaFromColumns } from '@/lib/zod.utils';

export const maxDuration = 30;

type Payload = {
    websites: WebsiteSuggestion[];
    columns: ComparisonColumn[];
};

export async function POST(req: Request) {
    const { websites, columns }: Payload = await req.json();

    const dynamicSchema = generateZodSchemaFromColumns(columns);

    const prompt = `You are generating a structured website comparison table.
    
Websites:
${websites.map((w, i) => `${i + 1}. ${w.title} (${w.url})`).join('\n')}
`;

    const result = streamObject({
        model: GlobalConfig.model,
        schema: dynamicSchema,
        output: 'array',
        prompt,
    });

    return result.toTextStreamResponse();
}
