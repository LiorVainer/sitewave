'use client';

import { experimental_useObject as useObject } from '@ai-sdk/react';
import { z } from 'zod';
import {WebsiteSuggestionSchema} from "@/models/website-suggestion.model";

const schema = z.array(WebsiteSuggestionSchema);

export default function SiteSuggestions() {
  const { object, submit, isLoading, stop } = useObject({
    api: '/api/ai/website-suggestions',
    schema,
  });

    console.log({object, isLoading, stop});

  return (
      <div className="max-w-3xl mx-auto space-y-6 py-6">
        <h1 className="text-2xl font-semibold">Discover Websites</h1>

        <button
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded shadow hover:opacity-90 transition"
            onClick={() => submit('Best AI tools for productivity')}
            disabled={isLoading}
        >
          Generate Website Suggestions
        </button>

        {isLoading && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Loading suggestions...</p>
              <button
                  className="text-sm underline text-red-500"
                  type="button"
                  onClick={() => stop()}
              >
                Stop Generation
              </button>
            </div>
        )}

        {object?.length === 0 && !isLoading && (
            <p className="text-gray-500">No suggestions yet. Click the button above.</p>
        )}

        <div className="grid gap-4">
          {object?.map((site, index) => (
              <div
                  key={index}
                  className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  {site?.favicon && (
                      <img
                          src={site?.favicon}
                          alt="favicon"
                          className="w-6 h-6 rounded"
                      />
                  )}
                  <a
                      href={site?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-blue-600 hover:underline"
                  >
                    {site?.title}
                  </a>
                </div>
                <p className="text-sm text-gray-700 mt-1">{site?.description}</p>
                <p className="text-xs text-gray-500 mt-2 italic">{site?.reason}</p>

                {site?.tags?.length && site?.tags?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1 text-xs text-gray-500">
                      {site?.tags.map((tag, idx) => (
                          <span key={idx} className="bg-gray-100 px-2 py-1 rounded">
                    #{tag}
                  </span>
                      ))}
                    </div>
                )}

                {site?.suggestedFolderPath && (
                    <p className="text-xs text-purple-500 mt-2">
                      Suggested folder: <strong>{site?.suggestedFolderPath.join(' / ')}</strong>
                    </p>
                )}
              </div>
          ))}
        </div>
      </div>
  );
}
