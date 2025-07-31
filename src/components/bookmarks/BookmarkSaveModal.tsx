'use client';

import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '@convex/api';
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WebsiteSuggestion, WebsiteSuggestionSchema } from '@/models/website-suggestion.model';
import { toast } from 'sonner';
import { BookmarkTree } from '@/components/bookmarks/bookmarks-tree/BookmarkTree';
import { Folder } from 'lucide-react';
import { GroupMotionHighlight } from '@/components/animate-ui/effects/group-motion-highlight';

export type BookmarkSaveModalProps = {
    websiteSuggestion: WebsiteSuggestion;
};

export const BookmarkSaveModal = ({ websiteSuggestion }: BookmarkSaveModalProps) => {
    const { isAuthenticated } = useConvexAuth();
    const foldersAndBookmarks = useQuery(api.bookmarks.getUserFoldersAndBookmarksFlat, isAuthenticated ? {} : 'skip');
    const saveBookmark = useMutation(api.bookmarks.saveWebsiteSuggestionAsBookmark);
    const handleSaveBookmark = async () => {
        if (!websiteSuggestion?.title || !websiteSuggestion?.url || !websiteSuggestion.suggestedFolderPath) return;
        const { data: validWebsiteSuggestion, error } = WebsiteSuggestionSchema.safeParse(websiteSuggestion);

        if (error) {
            console.error(error);
            return;
        }

        toast.promise(saveBookmark({ websiteSuggestion: validWebsiteSuggestion }), {
            loading: 'Saving...',
            success: 'Bookmark saved successfully!',
            error: 'Failed to save bookmark.',
            invert: true,
        });
    };

    return (
        <DialogContent className='flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:hidden'>
            <DialogHeader className='contents space-y-0 text-left'>
                <DialogTitle className='border-b px-6 py-4 text-base'>
                    Select Folder For Saving "{websiteSuggestion.title}" Bookmark
                </DialogTitle>
                <div className='overflow-y-auto'>
                    <DialogDescription asChild>
                        <GroupMotionHighlight>
                            <div className='px-6 py-4'>
                                {foldersAndBookmarks && <BookmarkTree data={foldersAndBookmarks} />}
                            </div>
                        </GroupMotionHighlight>
                    </DialogDescription>
                </div>
                <DialogFooter className='border-t px-6 py-4'>
                    {websiteSuggestion?.suggestedFolderPath && websiteSuggestion?.suggestedFolderPath?.length > 0 && (
                        <div className='flex items-center gap-1 text-xs text-purple-500'>
                            <Folder className='w-3.5 h-3.5 shrink-0' />
                            <span className='truncate'>{websiteSuggestion.suggestedFolderPath.join(' / ')}</span>
                        </div>
                    )}
                    <DialogClose asChild>
                        <Button type='button' onClick={handleSaveBookmark}>
                            Save
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogHeader>
        </DialogContent>
    );
};
