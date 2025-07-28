'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Folder } from 'lucide-react';
import Link from 'next/link';
import { api } from '../../../../convex/_generated/api';
import { useQuery } from 'convex/react';
import { Id } from '../../../../convex/_generated/dataModel';

export default function FolderPage() {
    const { id } = useParams();
    const folderId = id as Id<'folders'>;

    const data = useQuery(api.bookmarks.getFolderContents, folderId ? { folderId: folderId } : 'skip');

    if (data === null) return <p className='p-6 text-red-500'>Folder not found or access denied</p>;

    return (
        <div className='p-6 space-y-6'>
            <h1 className='text-2xl font-semibold flex items-center gap-2'>
                <Folder className='w-6 h-6' />
                {data?.folder?.name ?? 'Loading...'}
            </h1>

            {/* Subfolders */}
            {data?.subfolders && data?.subfolders.length > 0 && (
                <div>
                    <h2 className='text-lg font-medium'>Subfolders</h2>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-2'>
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
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2'>
                        {data.bookmarks.map((bookmark) => (
                            <Card key={bookmark._id} className='hover:shadow-md transition'>
                                <CardContent className='p-4 space-y-2'>
                                    <a
                                        href={bookmark.url}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-blue-600 font-medium hover:underline'
                                    >
                                        {bookmark.title}
                                    </a>
                                    <p className='text-xs text-muted-foreground truncate'>{bookmark.url}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {data?.bookmarks?.length === 0 && data?.subfolders?.length === 0 && (
                <p className='text-muted-foreground'>This folder is empty.</p>
            )}
        </div>
    );
}
