import { ComparisonColumn, StaticZodFields } from '../models/website-comparison.model';
import z, { ZodObject, ZodTypeAny } from 'zod';

const zodTypeMap = {
    string: z.string(),
    number: z.number(),
    boolean: z.boolean(),
} satisfies Record<ComparisonColumn['zodType'], ZodTypeAny>;

export const staticZodSchema = z.object(StaticZodFields);
export type StaticZodType = z.infer<typeof staticZodSchema>;

export type DynamicZodRecordSchema = Record<string, ZodTypeAny>;
export type DynamicZodSchemaObject = ZodObject<DynamicZodRecordSchema>;

export type FullDynamicZodType<T extends DynamicZodSchemaObject = any> = StaticZodType & z.infer<T>;

export function generateZodSchemaFromColumns(columns: ComparisonColumn[]): DynamicZodSchemaObject {
    const shape: DynamicZodRecordSchema = { ...StaticZodFields };

    try {
        for (const col of columns) {
            if (col.zodKey in StaticZodFields) continue;
            shape[col.zodKey] = zodTypeMap[col.zodType].describe(col.zodDesc);
        }
    } catch (error) {
        console.error('Error generating Zod schema:', error);
        throw new Error('Failed to generate Zod schema from columns');
    }

    return z.object(shape);
}
