import { CoreMessage, CoreSystemMessage, generateObject, generateText, streamObject, streamText } from 'ai';
import { AIConfig } from './ai.const';
import { AIServiceProviderInterface, ObjectMethodConfig, TextMethodConfig } from './ai.types';
import { AILogger } from './ai.logger';

class AIServiceProvider implements AIServiceProviderInterface {
    async generateText(
        prompt: string,
        { saveOutputToFile, systemMessages }: TextMethodConfig = {
            systemMessages: [],
            saveOutputToFile: false,
        }
    ) {
        try {
            const start = new Date().getTime();
            const configMessages = (AIConfig.generateText.messages ?? []) as CoreMessage[];
            const userMessage: CoreMessage = { role: 'user', content: prompt };
            const messages: CoreMessage[] = systemMessages
                ? [...configMessages, ...systemMessages, userMessage]
                : [...configMessages, userMessage];

            const { text, finishReason } = await generateText({
                ...AIConfig.generateText,
                messages,
            });

            const end = new Date().getTime();

            if (saveOutputToFile) {
                AILogger.saveTextMethodOutputToFile('generateText', {
                    responseText: text,
                    messages,
                    prompt,
                    finishReason,
                    execution: { start, end },
                });
            }

            return text;
        } catch (error) {
            console.log('Error Trying To Generate Text From AI Model', error);
            throw error;
        }
    }

    async streamText(
        prompt: string,
        { saveOutputToFile, systemMessages }: TextMethodConfig = {
            systemMessages: [],
            saveOutputToFile: false,
        }
    ) {
        try {
            const start = new Date().getTime();

            const configMessages = (AIConfig.generateText.messages ?? []) as CoreMessage[];
            const userMessage: CoreMessage = { role: 'user', content: prompt };
            const messages: CoreMessage[] = systemMessages
                ? [...configMessages, ...systemMessages, userMessage]
                : [...configMessages, userMessage];

            const { text, finishReason } = streamText({
                ...AIConfig.generateText,
                messages,
            });

            if (saveOutputToFile) {
                const end = new Date().getTime();
                AILogger.saveTextMethodOutputToFile('streamText', {
                    responseText: await text,
                    messages,
                    prompt,
                    finishReason: await finishReason,
                    execution: { start, end },
                });
            }

            return await text;
        } catch (error) {
            console.log('Error Trying Streaming Text From AI Model', error);
            throw error;
        }
    }

    async generateObject<T>(
        {
            saveOutputToFile = false,
            messages: inputMessages = [],
            schemaDescription,
            schema,
            noTokensLimit,
            output,
            ...restConfig
        }: ObjectMethodConfig<T>,
        prompt?: string
    ) {
        try {
            const start = new Date().getTime();
            const configMessages = (AIConfig.generateObject.messages ?? []) as CoreMessage[];

            const userMessage: CoreMessage | undefined = !!prompt ? { role: 'user', content: prompt } : undefined;
            const messages: CoreMessage[] = userMessage
                ? [...configMessages, ...inputMessages, userMessage]
                : [...configMessages, ...inputMessages];

            const { maxTokens: globalConfigMaxTokens, ...globalConfig } = AIConfig.generateObject;

            const config = {
                ...globalConfig,
                ...(!noTokensLimit && { maxTokens: globalConfigMaxTokens }),
                ...restConfig,
                schema,
                schemaDescription: schemaDescription ?? schema._def.description,
                messages,
                output,
            };

            const { object, finishReason, usage } = await generateObject(config as any);

            const end = new Date().getTime();

            if (saveOutputToFile) {
                AILogger.saveObjectMethodOutputToFile('generateObject', {
                    messages,
                    schema,
                    prompt,
                    object,
                    finishReason,
                    execution: { start, end },
                });
            }

            return { data: object, usage };
        } catch (error) {
            console.log('Error Trying To Generate Text From AI Model', error);
            throw error;
        }
    }

    async streamObject<T>(
        { schema, schemaName, schemaDescription, saveOutputToFile = false, messages: inputMessages = []}: ObjectMethodConfig<T>,
        prompt?: string,
    ) {
        try {
            const start = new Date().getTime();

            const configMessages = (AIConfig.generateObject.messages ?? []) as CoreMessage[];


            const userMessage: CoreMessage | undefined = !!prompt ? { role: 'user', content: prompt } : undefined;
            const messages: CoreMessage[] = userMessage
                ? [...configMessages, ...inputMessages, userMessage]
                : [...configMessages, ...inputMessages];

            const { object } = streamObject({
                ...AIConfig.streamObject,
                schema,
                schemaName: schemaName ?? schema._def.description,
                schemaDescription: schemaDescription ?? schema._def.description,
                messages,
            });

            if (saveOutputToFile) {
                const end = new Date().getTime();
                AILogger.saveObjectMethodOutputToFile('streamObject', {
                    messages,
                    prompt,
                    schema,
                    object: await object,
                    execution: { start, end },
                });
            }

            return await object;
        } catch (error) {
            console.log('Error Trying To Generate Text From AI Model', error);
            throw error;
        }
    }

    static create() {
        return new AIServiceProvider();
    }
}

export const AIService = AIServiceProvider.create();
