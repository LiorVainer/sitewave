import { z } from 'zod';
import { DeepPartial } from 'ai';

export const WebsiteSuggestionSchema = z.object({
    title: z.string().min(1).describe("The title of the suggested website (e.g., 'Notion')"),

    url: z.string().describe("The full URL to the suggested website (e.g., 'https://www.notion.so')"),

    description: z.string().min(1).describe('A short summary of what the website does or offers'),

    tags: z
        .array(z.string())
        .optional()
        .describe("Optional tags for categorizing the website (e.g., ['ai', 'writing'])"),

    sources: z
        .object({
            name: z.string().describe('Name of the source where the suggestion was found'),
            url: z.string().describe('URL of the source where the suggestion was found'),
        })
        .array()
        .optional()
        .describe('Optional array of sources where the suggestion was found'),

    videosOfWebsite: z
        .array(
            z.object({
                title: z.string().describe('Title of the video'),
                url: z.string().describe('URL to the video'),
            }),
        )
        .optional()
        .describe('Optional array of videos related to the website'),

    suggestedFolderPath: z
        .array(z.string())
        .min(1)
        .describe("Path from the root folder to where this bookmark should be saved, e.g., ['AI', 'Productivity']"),
});

export type WebsiteSuggestion = z.infer<typeof WebsiteSuggestionSchema>;

export type PartialWebsiteSuggestion = DeepPartial<WebsiteSuggestion>;

export type WebsiteSuggestionWithMandatoryFields = PartialWebsiteSuggestion &
    Pick<WebsiteSuggestion, 'url' | 'title' | 'description'>;

export const WebsiteSuggestionsGenerationPayloadSchema = z.object({
    amount: z.number().min(1).max(10).describe('Number of website suggestions to generate (1-20)'),
    prompt: z.string().min(1).describe('Prompt or context for generating website suggestions'),
});

export type WebsiteSuggestionsGenerationPayload = z.infer<typeof WebsiteSuggestionsGenerationPayloadSchema>;
