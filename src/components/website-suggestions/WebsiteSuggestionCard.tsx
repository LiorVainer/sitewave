import { Card, CardContent } from '@/components/ui/card';
import { CopyButton } from '@/components/animate-ui/buttons/copy';
import { ResponseStream } from '@/components/ui/response-stream';
import { WebsiteSuggestion } from '@/models/website-suggestion.model';
import { DeepPartial } from 'ai';
import { Folder } from 'lucide-react';

interface SuggestionCardProps {
  website?: DeepPartial<WebsiteSuggestion>;
}

const RESPONSE_STREAM_SPEED = 30; // Adjust speed as needed

export const WebsiteSuggestionCard = ({ website }: SuggestionCardProps) => {
  return (
    <Card className='transition hover:shadow-md border border-border'>
      <CardContent className='space-y-2'>
        <div className='flex justify-between items-start'>
          <div className='flex items-center gap-3'>
            {website?.favicon && <img src={website.favicon} alt='' className='w-6 h-6 rounded' />}
            <a
              href={website?.url ?? '#'}
              target='_blank'
              rel='noopener noreferrer'
              className='text-lg font-semibold text-blue-600 hover:underline'
            >
              <ResponseStream textStream={website?.title ?? ''} mode='typewriter' />
            </a>
          </div>
          {website?.url && <CopyButton variant='outline' content={website.url} size='sm' />}
        </div>

        <ResponseStream
          speed={RESPONSE_STREAM_SPEED}
          textStream={website?.description ?? ''}
          mode='typewriter'
          className='text-sm text-gray-700'
        />
        <ResponseStream
          speed={RESPONSE_STREAM_SPEED}
          textStream={website?.reason ?? ''}
          mode='typewriter'
          className='text-xs text-muted-foreground italic'
        />

        {website?.tags && website?.tags?.length > 0 && (
          <div className='flex flex-wrap gap-2 text-xs text-gray-500 pt-1'>
            {website.tags.map((tag, idx) => (
              <span key={idx} className='bg-muted px-2 py-0.5 rounded-full border border-border'>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {website?.suggestedFolderPath && website?.suggestedFolderPath?.length > 0 && (
          <div className='flex items-center gap-1 text-xs text-purple-500'>
            <Folder className='w-3.5 h-3.5 shrink-0' />
            <span className='truncate'>{website.suggestedFolderPath.join(' / ')}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
