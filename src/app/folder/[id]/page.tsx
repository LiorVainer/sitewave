'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Folder } from 'lucide-react';
import Link from 'next/link';
import { api } from '@convex/api';
import { useConvexAuth, useQuery } from 'convex/react';
import { Id } from '@convex/dataModel';
import { SignedIn } from '@clerk/nextjs';
import { WebsiteBookmarkCard } from '@/components/websites/WebsiteBookmarkCard';

export default function FolderPage() {
    const { id } = useParams();
    const folderId = id as Id<'folders'>;
    const { isAuthenticated } = useConvexAuth();
    const data = useQuery(
        api.bookmarks.getFolderContents,
        isAuthenticated && folderId ? { folderId: folderId } : 'skip',
    );

    const router = useRouter();

    if (data === null) return <p className='p-6 text-red-500'>Folder not found or access denied</p>;

    return (
        <SignedIn>
            <div className='p-4 space-y-6 lg:p-12 2xl:p-24 flex flex-col'>
                <h1 className='text-2xl font-semibold flex items-center gap-2'>
                    <Folder className='w-6 h-6' />
                    {data?.folder?.name ?? 'Loading...'}
                </h1>

                {/* Subfolders */}
                {data?.subfolders && data?.subfolders.length > 0 && (
                    <div>
                        <h2 className='text-lg font-medium'>Subfolders</h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 mt-2'>
                            {data.subfolders.map((sub) => (
                                <Link key={sub._id} href={`/folder/${sub._id}`}>
                                    <Card className='hover:shadow-md transition cursor-pointer'>
                                        <CardContent className='p-4 flex items-center gap-2'>
                                            <Folder className='w-4 h-4 text-muted-foreground' />
                                            <span>{sub.name}</span>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bookmarks */}
                {data?.bookmarks && data?.bookmarks?.length > 0 && (
                    <div>
                        <h2 className='text-lg font-medium mt-6'>Bookmarks</h2>
                        <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 mt-2'>
                            {data.bookmarks.map((bookmark) => (
                                <WebsiteBookmarkCard key={bookmark.website?.url} website={bookmark.website!} />
                            ))}
                        </div>
                    </div>
                )}

                {data?.bookmarks?.length === 0 && data?.subfolders?.length === 0 && (
                    <p className='text-muted-foreground'>This folder is empty.</p>
                )}
            </div>
        </SignedIn>
    );
}
