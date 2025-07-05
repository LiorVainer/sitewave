'use client';

import { StreamableValue, useStreamableValue } from 'ai/rsc';
import { WebsiteSuggestionsCards } from './WebsiteSuggestionsCards';
import { PartialWebsiteSuggestion } from '@/models/website-suggestion.model';

interface Props {
  allSuggestions: PartialWebsiteSuggestion[];
  stream: StreamableValue<PartialWebsiteSuggestion[]>;
  resetSignal: number;
  onFinish?: (suggestions: PartialWebsiteSuggestion[]) => void;
}

export function WebsiteSuggestionsStream({ stream, resetSignal, onFinish, allSuggestions }: Props) {
  const [newSuggestions, , isLoading] = useStreamableValue(stream);

  return (
    <WebsiteSuggestionsCards
      allSuggestions={allSuggestions}
      newSuggestions={newSuggestions ?? []}
      isLoading={isLoading}
      resetSignal={resetSignal}
      onFinish={onFinish}
    />
  );
}
