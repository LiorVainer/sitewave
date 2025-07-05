'use client';

import { useState } from 'react';
import { StreamableValue } from 'ai/rsc';
import { PartialWebsiteSuggestion } from '@/models/website-suggestion.model';
import { suggestWebsites } from '@/app/actions';
import { WebsiteSuggestionInput } from '@/components/website-suggestions/WebsiteSuggestionInput';
import { WebsiteSuggestionsStream } from '@/components/WebsiteSuggestionsStream';

export function WebsiteSuggestionsChat() {
  const [stream, setStream] = useState<StreamableValue<PartialWebsiteSuggestion[]> | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [allSuggestions, setAllSuggestions] = useState<PartialWebsiteSuggestion[]>([]);
  const [input, setInput] = useState('');
  const [sentPrompt, setSentPrompt] = useState('');

  const handleSubmit = async (prompt: string, amount: number[]) => {
    if (!prompt.trim() || prompt === sentPrompt) return;
    setSentPrompt(prompt);
    setAllSuggestions([]);
    const result = await suggestWebsites(prompt, amount[0]);
    setStream(result);
    setResetSignal((n) => n + 1);
  };

  const handleFinish = (newOnes: PartialWebsiteSuggestion[]) => {
    setAllSuggestions((prev) => {
      const existing = new Set(prev.map((s) => s.title));
      const merged = newOnes.filter((s) => !existing.has(s.title));
      return [...prev, ...merged];
    });
  };

  return (
    <div className='space-y-6 py-6 px-6 w-full @4xl/main:px-[5cqw] @5xl/main:px-[15cqw] @7xl/main:px-[25cqw] lg:py-16'>
      <h1 className='text-2xl font-semibold'>Discover Websites</h1>

      <WebsiteSuggestionInput
        value={input}
        setValue={setInput}
        onSubmit={handleSubmit}
        placeholder='e.g. Best tools for productivity'
        className='w-full'
      />

      {stream && (
        <WebsiteSuggestionsStream
          allSuggestions={allSuggestions}
          stream={stream}
          resetSignal={resetSignal}
          onFinish={handleFinish}
        />
      )}

      {allSuggestions.length > 0 && (
        <p className='text-sm text-gray-500'>{allSuggestions.length} suggestions collected so far</p>
      )}
    </div>
  );
}
