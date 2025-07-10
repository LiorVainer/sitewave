import { google } from '@ai-sdk/google';
import { ENV } from '@/env/env.config';
import { AIGlobalConfig, AIMethodConfigKeys, AIServiceMethod, AIServiceMethodsConfig } from './ai.types';

const model = google(ENV.AI_MODEL ?? 'gemini-2.0-flash-exp', {
    useSearchGrounding: true,
    dynamicRetrievalConfig: {
        mode: 'MODE_UNSPECIFIED',
    },
});

export const AIConfigParams = [
    'model',
    'maxTokens',
    'messages',
    'temperature',
    'providerOptions',
] satisfies AIMethodConfigKeys[];

export const GlobalConfig: AIGlobalConfig = {
    model,
    maxTokens: ENV.AI_MAX_TOKENS ?? 3000,
    temperature: ENV.AI_TEMPERATURE ?? 0.5,
};

export const AIConfig: AIServiceMethodsConfig = {
    generateText: {
        ...GlobalConfig,
    },
    streamText: {
        ...GlobalConfig,
    },
    generateObject: {
        ...GlobalConfig,
    },
    streamObject: {
        ...GlobalConfig,
    },
};

export const AIServiceMethodToKebabCase = {
    generateObject: 'generate-object',
    generateText: 'generate-text',
    streamObject: 'stream-object',
    streamText: 'stream-text',
} satisfies Record<AIServiceMethod, string>;
