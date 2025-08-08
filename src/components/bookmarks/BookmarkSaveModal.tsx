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
import * as React from 'react';
import { useState } from 'react';
import { ColorPicker } from '@/components/ui/color-picker';
import { WebsiteLogo } from '@/components/websites/WebsiteLogo';

export type BookmarkSaveModalProps = {
    websiteSuggestion: WebsiteSuggestion;
};

export const DEFAULT_FOLDER_COLOR = '#3b82f6';

export const BookmarkSaveModal = ({ websiteSuggestion }: BookmarkSaveModalProps) => {
    const { isAuthenticated } = useConvexAuth();
    const foldersAndBookmarks = useQuery(api.bookmarks.getUserFoldersAndBookmarksFlat, isAuthenticated ? {} : 'skip');
    const saveBookmark = useMutation(api.bookmarks.saveWebsiteSuggestionAsBookmark);

    const [step, setStep] = useState<'folder' | 'color'>('folder');
    const [selectedFolderPath, setSelectedFolderPath] = useState<string[]>(websiteSuggestion.suggestedFolderPath);
    const [selectedColor, setSelectedColor] = useState(DEFAULT_FOLDER_COLOR);

    const handleSaveBookmark = async () => {
        if (!websiteSuggestion?.title || !websiteSuggestion?.url) return;
        const { data: validWebsiteSuggestion, error } = WebsiteSuggestionSchema.safeParse(websiteSuggestion);

        if (error) {
            console.error(error);
            return;
        }

        toast.promise(
            saveBookmark({
                websiteSuggestion: validWebsiteSuggestion,
                selectedFolderPath,
                selectedFolderColor: selectedColor,
            }),
            {
                loading: 'Saving...',
                success: 'Bookmark saved successfully!',
                error: 'Failed to save bookmark.',
                invert: true,
            },
        );
    };

    const isFolderStep = step === 'folder';
    const canContinue = selectedFolderPath.length > 0;

    return (
        <DialogContent className='flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:hidden'>
            <DialogHeader className='contents space-y-0 text-left'>
                <DialogTitle className='border-b px-6 py-4 text-base'>
                    <div className='flex justify-between w-full gap-2'>
                        <div className='flex gap-0 flex-col'>
                            <div className='flex gap-2'>
                                <WebsiteLogo url={websiteSuggestion.url} />{' '}
                                <p className=''>{websiteSuggestion.title}</p>
                            </div>
                            <p className='text-sm text-gray-500'>{websiteSuggestion.url}</p>
                        </div>
                        <p className='font-bold'>{isFolderStep ? 'Select Folder Path' : 'Pick a Folder Color'}</p>
                    </div>
                </DialogTitle>

                <div className='overflow-y-auto'>
                    <DialogDescription asChild>
                        <GroupMotionHighlight>
                            <div className='px-6 py-4 space-y-4'>
                                {isFolderStep ? (
                                    foldersAndBookmarks && (
                                        <BookmarkTree
                                            data={foldersAndBookmarks}
                                            onFolderSelect={setSelectedFolderPath}
                                        />
                                    )
                                ) : (
                                    <div className='flex items-center gap-4'>
                                        <ColorPicker
                                            value={selectedColor}
                                            onChange={setSelectedColor}
                                            className='w-full  rounded-md border bg-background p-4'
                                        />
                                    </div>
                                )}
                            </div>
                        </GroupMotionHighlight>
                    </DialogDescription>
                </div>

                <DialogFooter className='border-t px-6 py-4 flex items-center justify-between w-full'>
                    <div className='flex items-center justify-between w-full'>
                        <div className='flex items-center gap-2 text-xs text-purple-500 truncate max-w-[60%]'>
                            {selectedFolderPath.length > 0 && (
                                <>
                                    <Folder className='w-3.5 h-3.5 shrink-0' style={{ color: selectedColor }} />
                                    <span className='truncate' style={{ color: selectedColor }}>
                                        {selectedFolderPath.join(' / ')}
                                    </span>
                                </>
                            )}
                        </div>

                        <div className='flex gap-2'>
                            {!isFolderStep && (
                                <Button type='button' variant='ghost' onClick={() => setStep('folder')}>
                                    Back
                                </Button>
                            )}
                            {isFolderStep ? (
                                <Button type='button' onClick={() => setStep('color')} disabled={!canContinue}>
                                    Next
                                </Button>
                            ) : (
                                <DialogClose asChild>
                                    <Button type='button' onClick={handleSaveBookmark}>
                                        Save
                                    </Button>
                                </DialogClose>
                            )}
                        </div>
                    </div>
                </DialogFooter>
            </DialogHeader>
        </DialogContent>
    );
};
