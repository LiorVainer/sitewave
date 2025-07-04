import { Card, CardContent } from '@/components/ui/card';
import { CopyButton } from '@/components/animate-ui/buttons/copy';
import { ResponseStream } from '@/components/ui/response-stream';
import { PartialWebsiteSuggestion } from '@/models/website-suggestion.model';
import { Folder } from 'lucide-react';

interface SuggestionCardProps {
    website?: PartialWebsiteSuggestion;
}

const RESPONSE_STREAM_SPEED = 30; // Adjust speed as needed

export const WebsiteSuggestionCard = ({ website }: SuggestionCardProps) => {
    const video = website?.videosOfWebsite?.[0];
    const videoUrl = video?.url;
    const videoId = videoUrl?.split('v=')[1]?.split('&')[0];
    // Fallback thumbnail sizes: default → mqdefault → hqdefault
    const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
    return (
        <Card className='transition hover:shadow-md border border-border'>
            <CardContent className='space-y-4'>
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

                <div className='grid grid-cols-1 md:grid-cols-8 gap-6 items-center'>
                    <div className='col-span-1 md:col-span-5 flex flex-col justify-between gap-4'>
                        <div className='flex flex-col gap-2'>
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
                        </div>

                        <div className='flex flex-col gap-2'>
                            {website?.tags && website?.tags?.length > 0 && (
                                <div className='flex flex-wrap gap-2 text-xs text-gray-500 pt-1'>
                                    {website.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className='bg-muted px-2 py-0.5 rounded-full border border-border'
                                        >
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
                        </div>
                    </div>
                    {thumbnail && videoUrl && (
                        <a href={videoUrl} target='_blank' rel='noopener noreferrer' className='col-span-3'>
                            <img src={thumbnail} alt={video?.title} className='w-full aspect-16/9 rounded-xl' />
                        </a>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
