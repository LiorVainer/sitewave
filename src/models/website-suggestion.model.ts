import { z } from "zod";

export const WebsiteSuggestionSchema = z.object({
    title: z.string()
        .min(1)
        .describe("The title of the suggested website (e.g., 'Notion')"),

    url: z.string()
        .describe("The full URL to the suggested website (e.g., 'https://www.notion.so')"),

    description: z.string()
        .min(1)
        .describe("A short summary of what the website does or offers"),

    reason: z.string()
        .min(1)
        .describe("Explanation of why this site was recommended for the user's query"),

    tags: z.array(z.string())
        .optional()
        .describe("Optional tags for categorizing the website (e.g., ['ai', 'writing'])"),

    favicon: z.string()
        .optional()
        .describe("Optional URL to the website’s favicon or logo image"),

    suggestedFolderPath: z.array(z.string())
        .min(1)
        .describe("Path from the root folder to where this bookmark should be saved, e.g., ['AI', 'Productivity']")
});

export type WebsiteSuggestion = z.infer<typeof WebsiteSuggestionSchema>;