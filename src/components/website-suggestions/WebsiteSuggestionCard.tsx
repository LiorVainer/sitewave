'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CopyButton } from '@/components/animate-ui/buttons/copy';
import { ResponseStream } from '@/components/ui/response-stream';
import { PartialWebsiteSuggestion, WebsiteSuggestionSchema } from '@/models/website-suggestion.model';
import { Folder } from 'lucide-react';
import { api } from '../../../convex/_generated/api';
import { useConvexAuth, useMutation } from 'convex/react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { SignedIn } from '@clerk/nextjs';

interface SuggestionCardProps {
    website?: PartialWebsiteSuggestion;
    isStreaming?: boolean;
}

const RESPONSE_STREAM_SPEED = 30; // Adjust speed as needed

export const WebsiteSuggestionCard = ({ website, isStreaming = false }: SuggestionCardProps) => {
    const video = website?.videosOfWebsite?.[0];
    const { isAuthenticated } = useConvexAuth();
    const videoUrl = video?.url;
    const videoId = videoUrl?.split('v=')[1]?.split('&')[0];
    // Fallback thumbnail sizes: default → mqdefault → hqdefault
    const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
    const faviconUrl = website?.url
        ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(website?.url)}&sz=32`
        : website?.favicon;

    const saveBookmark = useMutation(api.bookmarks.saveWebsiteSuggestionAsBookmark);

    const handleSave = async () => {
        if (!isAuthenticated || !website?.title || !website?.url || !website.suggestedFolderPath) return;
        const { data: websiteSuggestion, error } = WebsiteSuggestionSchema.safeParse(website);
        if (error) {
            console.error(error);
            return;
        }

        try {
            const response = await saveBookmark({ websiteSuggestion });
            console.log('Bookmark saved response:', response);

            toast('Bookmark Saved', {
                description: `“${website.title}” has been saved successfully.`,
                duration: 3000,
            });
        } catch {
            toast('Failed to save', {
                description: 'Something went wrong while saving the bookmark.',
            });
        }
    };

    return (
        <Card className='transition hover:shadow-md border border-border'>
            <CardContent className='space-y-4'>
                <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-3'>
                        {website?.favicon && <img src={faviconUrl} alt='' className='w-6 h-6 rounded' />}
                        <a
                            href={website?.url ?? '#'}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-lg font-semibold text-blue-600 hover:underline'
                        >
                            {isStreaming ? (
                                <ResponseStream textStream={website?.title ?? ''} mode='typewriter' />
                            ) : (
                                website?.title
                            )}
                        </a>
                    </div>
                    {website?.url && (
                        <div className='flex gap-2'>
                            <CopyButton variant='outline' content={website.url} size='sm' />
                            <SignedIn>
                                <Button variant='outline' size='sm' onClick={handleSave}>
                                    Save
                                </Button>
                            </SignedIn>
                        </div>
                    )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-8 gap-6 items-center '>
                    <div className='col-span-1 md:col-span-5 flex flex-col justify-between gap-4 h-full'>
                        <div className='flex flex-col gap-2'>
                            {isStreaming ? (
                                <ResponseStream
                                    speed={RESPONSE_STREAM_SPEED}
                                    textStream={website?.description ?? ''}
                                    mode='typewriter'
                                    className='text-sm text-gray-700'
                                />
                            ) : (
                                <p className='text-sm text-gray-700'>{website?.description}</p>
                            )}
                            {isStreaming ? (
                                <ResponseStream
                                    speed={RESPONSE_STREAM_SPEED}
                                    textStream={website?.reason ?? ''}
                                    mode='typewriter'
                                    className='text-xs text-muted-foreground italic'
                                />
                            ) : (
                                <p className='text-xs text-muted-foreground italic'>{website?.reason}</p>
                            )}
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
