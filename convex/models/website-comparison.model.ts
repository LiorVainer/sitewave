import { z } from 'zod';

export const ComparisonColumnSchema = z.object({
    id: z.string(),
    header: z.string(),
    accessorKey: z.string(),
    zodKey: z.string().describe('Unique key for Zod object'),
    zodDesc: z.string().describe('Description for the field'),
    zodType: z.enum(['string', 'number', 'boolean']).describe('Zod type of the field'),
});

export type ComparisonColumn = z.infer<typeof ComparisonColumnSchema>;

export const WebsiteComparisonColumnsSchema = z
    .array(ComparisonColumnSchema)
    .describe('Array of objects representing each column in the comparison table');

export type WebsiteComparisonColumns = z.infer<typeof WebsiteComparisonColumnsSchema>;

export const ComparisonRowSchema = z.object({
    columnId: z.string().describe('The ID of the column this row belongs to'),
    value: z.string().describe('The value for this column in the row'),
});

export type ComparisonRow = z.infer<typeof ComparisonRowSchema>;

export const WebsiteComparisonRowsSchema = z.array(z.array(ComparisonRowSchema));

export type WebsiteComparisonRows = z.infer<typeof WebsiteComparisonRowsSchema>;

export const StaticZodFields = {
    favicon: z.string().optional().describe('Optional URL to the website’s favicon or logo image'),
    title: z.string().describe('Website title (pinned)'),
    url: z.string().describe('Website URL'),
    // description: z.string().optional().describe('Optional description of the website'),
};
