import {streamObject} from "ai";
import {GlobalConfig} from "@/ai/ai.const";
import {WebsiteSuggestionSchema} from "@/models/website-suggestion.model";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const context = await req.json();

    console.log('Received context:', context);

    const result = streamObject({
        model: GlobalConfig.model,
        output: 'array',
        schema: WebsiteSuggestionSchema,
        prompt: 'Generate 3 website suggestions based on the following context: ' + context,
    });

    return result.toTextStreamResponse();
}