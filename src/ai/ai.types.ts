import { CoreMessage, CoreSystemMessage, generateObject, generateText, streamObject, streamText } from 'ai';
import { ZodSchema } from 'zod';
import { AIConfigParams } from './ai.const';

export type SchemaConfig<T> = {
    schema: ZodSchema<T>;
    schemaName?: string;
    schemaDescription?: string;
};

export type ObjectMethodConfig<T> = Partial<AIGlobalConfig> & {
    schema: ZodSchema<T>;
    schemaName?: string;
    messages?: CoreMessage[];
    schemaDescription?: string;
    saveOutputToFile?: boolean;
    noTokensLimit?: boolean;
};

export type TextMethodConfig = {
    systemMessages?: CoreSystemMessage[];
    saveOutputToFile?: boolean;
};

type AIServiceMethods = {
    generateText: typeof generateText;
    streamText: typeof streamText;
    generateObject: typeof generateObject;
    streamObject: typeof streamObject;
};

export type AIServiceMethod = keyof AIServiceMethods;

export type AIServiceProviderInterface = {
    [K in keyof AIServiceMethods]: (...args: any) => any;
};

export type AIMethodConfigKeys = keyof Parameters<typeof streamText>[0];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BaseServiceMethod = 'generateText' satisfies AIServiceMethod;

export type AIGlobalConfig = Pick<
    Parameters<AIServiceMethods[typeof BaseServiceMethod]>[0],
    (typeof AIConfigParams)[number]
>;

export type AIServiceMethodsConfig = {
    [K in keyof AIServiceMethods]: Pick<Parameters<AIServiceMethods[K]>[0], (typeof AIConfigParams)[number]>;
};

export type ExecutionTime = {
    start: number;
    end: number;
};

export type BaseOutputToFileParams = {
    messages: CoreMessage[];
    prompt?: string;
    execution?: ExecutionTime;
    finishReason?: string;
    outputFolderPath?: string;
};

export type SaveObjectMethodOutputToFileParams<T> = BaseOutputToFileParams & {
    schema: SchemaConfig<T>['schema'];
    object: T;
};

export type SaveTextMethodOutputToFileParams = BaseOutputToFileParams & {
    responseText: string;
};
