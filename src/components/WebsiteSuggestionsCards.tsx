'use client';

import { useEffect, useState } from 'react';
import { PartialWebsiteSuggestion } from '@/models/website-suggestion.model';
import { WebsiteSuggestionCard } from './website-suggestions/WebsiteSuggestionCard';
import { WebsiteSuggestionCardSkeleton } from './website-suggestions/WebsiteSuggestionCardSkeleton';

interface Props {
  allSuggestions: PartialWebsiteSuggestion[];
  newSuggestions: PartialWebsiteSuggestion[];
  isLoading: boolean;
  resetSignal: number;
  onFinish?: (all: PartialWebsiteSuggestion[]) => void;
}

const MAX_SKELETONS = 3;

export function WebsiteSuggestionsCards({ allSuggestions, newSuggestions, isLoading, resetSignal, onFinish }: Props) {
  const [localSuggestions, setLocalSuggestions] = useState<PartialWebsiteSuggestion[]>([]);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    setHasSaved(false); // don't clear local suggestions
  }, [resetSignal]);

  useEffect(() => {
    if (!newSuggestions) return;
    setLocalSuggestions((prev) => {
      const existing = new Set(prev.map((s) => s.title));
      const newOnes = newSuggestions.filter((s) => !existing.has(s.title));
      return [...prev, ...newOnes];
    });
  }, [newSuggestions]);

  useEffect(() => {
    if (!isLoading && localSuggestions.length > 0 && !hasSaved) {
      onFinish?.(localSuggestions);
      setHasSaved(true);
    }
  }, [isLoading, localSuggestions, hasSaved, onFinish]);

  const skeletonCount = Math.max(MAX_SKELETONS - localSuggestions.length, 0);

  console.log({ allSuggestions, newSuggestions, localSuggestions, isLoading, resetSignal, skeletonCount });

  return (
    <div className='flex flex-col gap-6'>
      {isLoading && (
        <div className='text-sm text-gray-500 flex justify-between items-center'>
          <p>Generating suggestions...</p>
        </div>
      )}

      <div className='grid gap-6'>
        {allSuggestions.map((s, i) => (
          <WebsiteSuggestionCard key={i} website={s} />
        ))}
        {localSuggestions.map((s, i) => (
          <WebsiteSuggestionCard key={i} website={s} />
        ))}
      </div>

      {isLoading && <WebsiteSuggestionCardSkeleton count={skeletonCount} />}
    </div>
  );
}
