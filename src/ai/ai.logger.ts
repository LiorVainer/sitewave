import {
    AIServiceMethod,
    ExecutionTime,
    SaveObjectMethodOutputToFileParams,
    SaveTextMethodOutputToFileParams,
} from './ai.types';
import { zodToJsonSchema } from 'zod-to-json-schema';
import fs from 'fs';
import { DATE_AND_TIME_JSON_FORMAT, formatDate } from '../utils/date.utils';
import { AIServiceMethodToKebabCase } from './ai.const';
import { CoreMessage } from 'ai';
import { isProduction } from '../app';

const BASE_OUTPUT_FOLDER_PATH = './output';

class AILoggerProvider {
    saveObjectMethodOutputToFile<T>(
        method: AIServiceMethod,
        {
            messages,
            prompt,
            schema,
            object,
            execution,
            outputFolderPath,
            finishReason,
        }: SaveObjectMethodOutputToFileParams<T>
    ) {
        if (isProduction) {
            return;
        }

        const { userPrompt, systemMessages, executionTimeInSeconds } = this.generateLogMetadata(
            messages,
            prompt,
            execution
        );

        const output = {
            ...(execution && {
                execution: {
                    duration: executionTimeInSeconds,
                    units: 'seconds',
                    start: new Date(execution.start).toLocaleString(),
                    end: new Date(execution.end).toLocaleString(),
                },
            }),
            systemMessages,
            userPrompt,
            responseObject: object,
            schema: zodToJsonSchema(schema),
            ...(finishReason && { finishReason }),
        };

        const fileName = `${schema._def.description?.substring(0, 20) ?? ''}-${AIServiceMethodToKebabCase[method]}-${formatDate(new Date(), DATE_AND_TIME_JSON_FORMAT)}.json`;
        const outputFullPath = `${outputFolderPath ?? BASE_OUTPUT_FOLDER_PATH}/${fileName}`;

        fs.writeFileSync(outputFullPath, JSON.stringify(output));
    }

    saveTextMethodOutputToFile(
        method: AIServiceMethod,
        { messages, responseText, prompt, execution, outputFolderPath, finishReason }: SaveTextMethodOutputToFileParams
    ) {
        if (isProduction) {
            return;
        }

        const { userPrompt, systemMessages, executionTimeInSeconds } = this.generateLogMetadata(
            messages,
            prompt,
            execution
        );

        const output = {
            ...(execution && {
                execution: {
                    duration: executionTimeInSeconds,
                    units: 'seconds',
                    start: new Date(execution.start).toLocaleString(),
                    end: new Date(execution.end).toLocaleString(),
                },
            }),
            systemMessages,
            userPrompt,
            responseText,
            ...(finishReason && { finishReason }),
        };

        const fileName = `${AIServiceMethodToKebabCase[method]}-${formatDate(new Date(), DATE_AND_TIME_JSON_FORMAT)}.json`;
        const outputFullPath = `${outputFolderPath ?? BASE_OUTPUT_FOLDER_PATH}/${fileName}`;

        fs.writeFileSync(outputFullPath, JSON.stringify(output));
    }

    generateLogMetadata = (messages: CoreMessage[], prompt?: string, execution?: ExecutionTime) => {
        const userPrompt =
            prompt ?? messages.filter((message) => message.role === 'user').map((message) => message.content);

        const systemMessages = messages
            .filter((message) => message.role === 'system')
            .map((message) => message.content);

        const executionTimeInMilliseconds = execution ? execution.end - execution.start : 0;
        const executionTimeInSeconds = executionTimeInMilliseconds / 1000;

        return {
            userPrompt,
            systemMessages,
            executionTimeInSeconds,
        };
    };

    create() {
        return new AILoggerProvider();
    }
}

export const AILogger = new AILoggerProvider().create();
