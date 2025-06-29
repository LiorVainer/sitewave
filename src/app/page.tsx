'use client';

import { experimental_useObject as useObject } from '@ai-sdk/react';
import { z } from 'zod';
import { WebsiteSuggestionSchema } from '@/models/website-suggestion.model';
import { WebsiteSuggestionInput } from '@/components/website-suggestions/WebsiteSuggestionInput';
import { WebsiteSuggestionCard } from '@/components/website-suggestions/WebsiteSuggestionCard';
import { WebsiteSuggestionCardSkeleton } from '@/components/website-suggestions/WebsiteSuggestionCardSkeleton';

const schema = z.array(WebsiteSuggestionSchema);

const MAX_AMOUNT_OF_LOADING_WEBSITES_SKELETONS = 3;

export default function SiteSuggestions() {
  const { object, submit, isLoading, stop } = useObject({
    api: '/api/ai/website-suggestions',
    schema,
  });

  console.log('Website suggestions object:', object);

  const skeletonCount = Math.max(MAX_AMOUNT_OF_LOADING_WEBSITES_SKELETONS - (object?.length ?? 0), 0);

  return (
    <div className='space-y-6 py-6 px-6 w-full @4xl/main:px-[5cqw] @5xl/main:px-[15cqw] @7xl/main:px-[25cqw] lg:py-16'>
      <h1 className='text-2xl font-semibold'>Discover Websites</h1>

      <WebsiteSuggestionInput
        onSubmit={(prompt, amount) => submit({ prompt, amount: amount[0] })}
        placeholder='e.g. Best tools for productivity'
        className='w-full'
      />

      <div className='flex flex-col gap-4'>
        {isLoading && (
          <div className='text-sm text-gray-500 flex items-center justify-between'>
            <p>Generating suggestions...</p>
            <button className='text-sm underline text-red-500' type='button' onClick={() => stop()}>
              Stop
            </button>
          </div>
        )}
        <div className='grid gap-4'>
          {object?.map((website, index) => (
            <WebsiteSuggestionCard key={index} website={website} />
          ))}
        </div>

        {isLoading && <WebsiteSuggestionCardSkeleton count={skeletonCount} />}
      </div>
    </div>
  );
}
