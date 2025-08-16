'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CopyButton } from '@/components/animate-ui/buttons/copy';
import { ResponseStream } from '@/components/ui/response-stream';
import { PartialWebsiteSuggestion, WebsiteSuggestion } from '@/models/website-suggestion.model';
import { Folder } from 'lucide-react';
import { api } from '@convex/api';
import { useQuery } from 'convex/react';
import { Button } from '../ui/button';
import { WebsitesVotes } from '@/components/website-suggestions/WebsitesVotes';
import { AuthSensitiveWrapper } from '@/components/wrappers/AuthSensitiveWrapper';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { BookmarkSaveModal } from '@/components/bookmarks/BookmarkSaveModal';
import { WebsiteLogo } from '@/components/websites/WebsiteLogo';

interface SuggestionCardProps {
    websiteSuggestion?: PartialWebsiteSuggestion;
    isStreaming?: boolean;
}

const RESPONSE_STREAM_SPEED = 30; // Adjust speed as needed

export const WebsiteSuggestionCard = ({ websiteSuggestion, isStreaming = false }: SuggestionCardProps) => {
    const video = websiteSuggestion?.videosOfWebsite?.[0];
    const videoUrl = video?.url;
    const videoId = videoUrl?.split('v=')[1]?.split('&')[0];
    // Fallback thumbnail sizes: default → mqdefault → hqdefault
    const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

    const website = useQuery(
        api.websites.getWebsiteByUrl,
        websiteSuggestion?.url ? { url: websiteSuggestion.url } : 'skip',
    );

    return (
        <Card className='transition hover:shadow-md border border-border py-4 @xl/main:py-6'>
            <CardContent className='space-y-4 px-4 @xl/main:px-6'>
                <div className='flex flex-col-reverse gap-6 @xl/main:flex-row @xl/main:justify-between items-start'>
                    <div className='flex items-center gap-3'>
                        {websiteSuggestion?.url && <WebsiteLogo url={websiteSuggestion?.url} />}
                        <a
                            href={websiteSuggestion?.url ?? '#'}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-lg font-semibold text-blue-600 hover:underline text-nowrap'
                        >
                            {isStreaming ? (
                                <ResponseStream textStream={websiteSuggestion?.title ?? ''} mode='typewriter' />
                            ) : (
                                websiteSuggestion?.title
                            )}
                        </a>
                        {websiteSuggestion?.url && (
                            <CopyButton variant='outline' content={websiteSuggestion?.url} size='sm' />
                        )}
                    </div>
                    <div className='flex gap-4 @xl/main:flex-row justify-between w-full @xl/main:items-center @xl/main:justify-end'>
                        {website && <WebsitesVotes website={website} />}
                        {websiteSuggestion?.url && !isStreaming && (
                            <div className='flex gap-2'>
                                <AuthSensitiveWrapper>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size='sm'>Save</Button>
                                        </DialogTrigger>
                                        <BookmarkSaveModal websiteSuggestion={websiteSuggestion as WebsiteSuggestion} />
                                    </Dialog>
                                </AuthSensitiveWrapper>
                            </div>
                        )}
                    </div>
                </div>

                {/*{websiteSuggestion?.url && (*/}
                {/*    <WebPreview defaultUrl={websiteSuggestion.url} style={{ height: '400px' }}>*/}
                {/*        <WebPreviewNavigation>*/}
                {/*            <WebPreviewUrl src={websiteSuggestion.url} />*/}
                {/*        </WebPreviewNavigation>*/}
                {/*        <WebPreviewBody src={websiteSuggestion.url} />*/}
                {/*    </WebPreview>*/}
                {/*)}*/}

                <div className='grid grid-cols-1 md:grid-cols-8 gap-6 items-center '>
                    <div className='col-span-1 md:col-span-5 flex flex-col justify-between gap-4 h-full'>
                        <div className='flex flex-col gap-2'>
                            {isStreaming ? (
                                <ResponseStream
                                    speed={RESPONSE_STREAM_SPEED}
                                    textStream={websiteSuggestion?.description ?? ''}
                                    mode='typewriter'
                                    className='text-sm text-gray-700'
                                />
                            ) : (
                                <p className='text-sm text-gray-700'>{websiteSuggestion?.description}</p>
                            )}
                        </div>

                        <div className='flex flex-col gap-2'>
                            {websiteSuggestion?.tags && websiteSuggestion?.tags?.length > 0 && (
                                <div className='flex flex-wrap gap-2 text-xs text-gray-500 pt-1'>
                                    {websiteSuggestion.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className='bg-muted px-2 py-0.5 rounded-full border border-border'
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {websiteSuggestion?.suggestedFolderPath &&
                                websiteSuggestion?.suggestedFolderPath?.length > 0 && (
                                    <div className='flex items-center gap-1 text-xs text-purple-500'>
                                        <Folder className='w-3.5 h-3.5 shrink-0' />
                                        <span className='truncate'>
                                            {websiteSuggestion.suggestedFolderPath.join(' / ')}
                                        </span>
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
