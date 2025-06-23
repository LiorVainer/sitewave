import { z } from 'zod';


export const EnvSchema = z.object({
    // =======================
    // 🚀 Server Configuration
    // =======================
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    // =======================
    // 💡 AI Configuration
    // =======================
    GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
    AI_MODEL: z.string(),
    AI_MAX_TOKENS: z.coerce.number().int().min(1),
    AI_TEMPERATURE: z.coerce.number().min(0).max(1),
});

export type Env = z.infer<typeof EnvSchema>;

const { data: parsedEnv, error } = EnvSchema.safeParse(process.env);

if (error) {
    console.error(error.errors);
    throw new Error(error.errors[0].message);
}

export const ENV = parsedEnv;
