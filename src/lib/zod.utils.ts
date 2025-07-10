import { ComparisonColumn } from '@/models/website-comparison.model';
import z, { ZodObject, ZodTypeAny } from 'zod';

const zodTypeMap = {
    string: z.string(),
    number: z.number(),
    boolean: z.boolean(),
} satisfies Record<ComparisonColumn['zodType'], ZodTypeAny>;

export type DynamicZodRecordSchema = Record<string, ZodTypeAny>;
export type DynamicZodSchemaObject = ZodObject<DynamicZodRecordSchema>;
export type DynamicZodType = z.infer<DynamicZodSchemaObject>;

export function generateZodSchemaFromColumns(columns: ComparisonColumn[]): DynamicZodSchemaObject {
    const shape: DynamicZodRecordSchema = {};

    try {
        for (const col of columns) {
            const base = zodTypeMap[col.zodType];
            shape[col.zodKey] = base.describe(col.zodDesc);
        }
    } catch (error) {
        console.error('Error generating Zod schema:', error);
        throw new Error('Failed to generate Zod schema from columns');
    }

    return z.object(shape);
}
