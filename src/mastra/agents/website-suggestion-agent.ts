import { Agent } from '@mastra/core/agent';
import { GlobalConfig } from '@/ai/ai.const';
import { youtubeTool } from '../tools/youtube-tool';

export const websiteSuggestionAgent = new Agent({
  name: 'Website Suggestion Agent',
  instructions: `
    You are a helpful assistant that suggests websites based on a user prompt and enriches each suggestion with relevant YouTube videos.
    For each suggestion, provide:
    - title
    - description
    - url (if possible)
    - videosOfWebsite: up to 3 relevant YouTube videos (title and url)
    Use the youtubeTool to fetch videos for each website suggestion.
  `,
  model: GlobalConfig.model,
  tools: { youtubeTool },
});
