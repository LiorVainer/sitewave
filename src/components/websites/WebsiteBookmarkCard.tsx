'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CopyButton } from '@/components/animate-ui/buttons/copy';
import { Button } from '../ui/button';
import { WebsitesVotes } from '@/components/website-suggestions/WebsitesVotes';
import { AuthSensitiveWrapper } from '@/components/wrappers/AuthSensitiveWrapper';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { WebsiteLogo } from '@/components/websites/WebsiteLogo';
import { Doc } from '@convex/dataModel';

interface WebsiteBookmarkCardProps {
    website: Doc<'websites'>;
}

const RESPONSE_STREAM_SPEED = 30; // Adjust speed as needed

export const WebsiteBookmarkCard = ({ website }: WebsiteBookmarkCardProps) => {
    const video = website.videosOfWebsite?.[0];
    const videoUrl = video?.url;
    const videoId = videoUrl?.split('v=')[1]?.split('&')[0];
    // Fallback thumbnail sizes: default → mqdefault → hqdefault

    const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

    return (
        <Card className='transition hover:shadow-md border border-border py-4 @xl/main:py-6'>
            <CardContent className='space-y-4 px-4 @xl/main:px-6'>
                <div className='flex flex-row gap-6 @xl/main:flex-row justify-between items-start '>
                    <div className='flex items-center gap-3'>
                        {website?.url && <WebsiteLogo url={website?.url} />}
                        <a
                            href={website?.url ?? '#'}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-lg font-semibold text-blue-600 hover:underline text-nowrap'
                        >
                            {website?.name}
                        </a>
                        {website?.url && <CopyButton variant='outline' content={website?.url} size='sm' />}
                    </div>
                    <div className='flex gap-4 @xl/main:flex-row items-start  @xl/main:items-start @xl/main:justify-end h-full'>
                        <WebsitesVotes website={website} className='h-full' size='sm' />
                        {website.url && (
                            <div className='flex gap-2'>
                                <AuthSensitiveWrapper>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size='sm'>Edit</Button>
                                        </DialogTrigger>
                                        {/*<BookmarkSaveModal websiteSuggestion={websiteBookmark} />*/}
                                    </Dialog>
                                </AuthSensitiveWrapper>
                            </div>
                        )}
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-8 gap-6 items-end'>
                    <div className='col-span-1 md:col-span-5 flex flex-col justify-between gap-4 h-full'>
                        <div className='flex flex-col gap-2'>
                            <p className='text-sm text-gray-700'>{website?.description}</p>
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
