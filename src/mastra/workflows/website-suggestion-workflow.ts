// import { z } from 'zod';
// import { WebsiteSuggestionSchema, WebsiteSuggestionsGenerationPayloadSchema } from '@/models/website-suggestion.model';
// import { createWorkflow } from '@mastra/core/workflows';
// import { createTool } from '@mastra/core/tools';
// import { streamObject } from 'ai';
// import { GlobalConfig } from '@/ai/ai.const';
//
// const generateWebsiteSuggestions = createTool({
//   id: 'generate-website-suggestions',
//   description: 'Generates website suggestions based on a user prompt.',
//   inputSchema: WebsiteSuggestionsGenerationPayloadSchema,
//   outputSchema: z.array(WebsiteSuggestionSchema.omit({ videosOfWebsite: true })),
//   execute: async ({ context }) => {
//     const { prompt, amount } = context;
//     const { partialObjectStream } = streamObject({
//       model: GlobalConfig.model,
//       output: 'array', // ensures partialObjectStream: AsyncIterable<WebsiteSuggestion[]>
//       schema: WebsiteSuggestionSchema,
//       prompt: `Generate ${amount} Website suggestions based on the following context: ${prompt}`,
//     });
//
//     return partialObjectStream;
//   },
// });
//
// const enrichWithVideos = createTool({
//   id: 'enrich-with-videos',
//   description: 'Enriches website suggestions with relevant YouTube videos.',
//   inputSchema: z.object({
//     websiteSuggestions: z.array(WebsiteSuggestionSchema.omit({ videosOfWebsite: true })),
//   }),
//   outputSchema: z.array(WebsiteSuggestionSchema),
//   execute: async ({ context }) => {},
// });
// export const websiteSuggestionWorkflow = createWorkflow({
//   id: 'website-suggestion-workflow',
//   description: 'Suggests websites based on a prompt and enriches each with YouTube videos.',
//   inputSchema: z.object({
//     prompt: z.string().describe('The user prompt for website suggestions'),
//     amount: z.number().min(1).max(10).describe('Number of website suggestions to generate'),
//   }),
//   outputSchema: z.array(WebsiteSuggestionSchema),
// });
