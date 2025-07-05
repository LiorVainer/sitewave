import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
// import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { WebsiteSuggestionAgent } from './agents/website-suggestion-agent';
import { websiteSuggestionWorkflow } from './workflows/website-suggestion-workflow';

export const mastra = new Mastra({
  workflows: { weatherWorkflow, websiteSuggestionWorkflow },
  agents: { weatherAgent, websiteSuggestionAgent: WebsiteSuggestionAgent },
  // storage: new LibSQLStore({
  //   // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
  //   url: ":memory:",
  // }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
