// Allow streaming responses up to 30 seconds

import { mastra } from '@/mastra';

export const maxDuration = 30;

type Payload = {
  amount: number;
  prompt: string;
};

// export async function POST(req: Request) {
//     const { amount, prompt }: Payload = await req.json();
//
//     console.log(`Generating ${amount} website suggestions with prompt: ${prompt}`);
//
//     const result = streamObject({
//         model: GlobalConfig.model,
//         output: 'array',
//         schema: WebsiteSuggestionSchema,
//         prompt: `Generate ${amount} Website suggestions based on the following context: ${prompt}`,
//     });
//
//     return result.toTextStreamResponse();
// }

export async function POST(req: Request) {
  const { messages } = await req.json();
  const myAgent = mastra.getAgent('weatherAgent');
  const stream = await myAgent.stream(messages);
  return stream.toDataStreamResponse();
}
