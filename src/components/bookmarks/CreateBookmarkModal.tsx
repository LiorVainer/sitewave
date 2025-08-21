'use client';

import { useAction, useConvexAuth, useMutation, useQuery } from 'convex/react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { BookmarkTree } from '@/components/bookmarks/bookmarks-tree/BookmarkTree';
import { Check, Edit3, Folder, Globe, Loader2, X } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { ColorPicker } from '@/components/ui/color-picker';
import { WebsiteLogo } from '@/components/websites/WebsiteLogo';
import { useIsMobile } from '@/hooks/use-mobile';
import { WebsiteSuggestion, WebsiteSuggestionSchema } from '@/models/website-suggestion.model';
import { GroupMotionHighlight } from '@/components/animate-ui/effects/group-motion-highlight';

export const DEFAULT_FOLDER_COLOR = '#3b82f6';

type Step = 'url' | 'folder' | 'color';

const STEP_CONFIG: Record<Step, { title: string }> = {
    url: { title: 'Enter Website URL' },
    folder: { title: 'Select Folder' },
    color: { title: 'Pick Color' },
};

export const CreateBookmarkModal = () => {
    const { isAuthenticated } = useConvexAuth();
    const foldersAndBookmarks = useQuery(api.bookmarks.getUserFoldersAndBookmarksFlat, isAuthenticated ? {} : 'skip');
    const saveBookmark = useMutation(api.bookmarks.saveWebsiteSuggestionAsBookmark);
    const getWebsiteInfo = useAction(api.websiteSuggestions.getWebsiteInfoFromUrl);

    const [step, setStep] = useState<Step>('url');
    const [url, setUrl] = useState('');
    const [websiteInfo, setWebsiteInfo] = useState<WebsiteSuggestion | null>(null);
    const [isLoadingWebsiteInfo, setIsLoadingWebsiteInfo] = useState(false);
    const [selectedColor, setSelectedColor] = useState(DEFAULT_FOLDER_COLOR);
    const [selectedFolderPath, setSelectedFolderPath] = useState<string[]>([]);

    // Editable fields state
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [editableTitle, setEditableTitle] = useState('');
    const [editableDescription, setEditableDescription] = useState('');

    const isMobile = useIsMobile();

    // Refs to maintain cursor position
    const titleInputRef = React.useRef<HTMLInputElement>(null);
    const descriptionTextareaRef = React.useRef<HTMLTextAreaElement>(null);

    const handleGetWebsiteInfo = async () => {
        if (!url) return;

        try {
            const urlObj = new URL(url);
            if (!urlObj.protocol.startsWith('http')) {
                toast.error('Please enter a valid HTTP/HTTPS URL');
                return;
            }
        } catch {
            toast.error('Please enter a valid URL');
            return;
        }

        setIsLoadingWebsiteInfo(true);
        try {
            const info = await getWebsiteInfo({ url });
            setWebsiteInfo(info);
            setEditableTitle(info.title);
            setEditableDescription(info.description);
            setSelectedFolderPath(info.suggestedFolderPath || []);
            setStep('folder');
            toast.success('Website information retrieved!');
        } catch (error) {
            console.error('Error getting website info:', error);
            toast.error('Failed to get website information. Please try again.');
        } finally {
            setIsLoadingWebsiteInfo(false);
        }
    };

    const handleSaveTitle = () => {
        if (editableTitle.trim()) {
            setWebsiteInfo((prev: any) => ({ ...prev, title: editableTitle.trim() }));
            setIsEditingTitle(false);
        }
    };

    const handleSaveDescription = () => {
        if (editableDescription.trim()) {
            setWebsiteInfo((prev: any) => ({ ...prev, description: editableDescription.trim() }));
            setIsEditingDescription(false);
        }
    };

    const handleCancelTitleEdit = () => {
        setEditableTitle(websiteInfo?.title || '');
        setIsEditingTitle(false);
    };

    const handleCancelDescriptionEdit = () => {
        setEditableDescription(websiteInfo?.description || '');
        setIsEditingDescription(false);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditableTitle(e.target.value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        const cursorPosition = e.target.selectionStart;
        setEditableDescription(newValue);

        // Restore cursor position after state update
        requestAnimationFrame(() => {
            if (descriptionTextareaRef.current && cursorPosition !== null) {
                descriptionTextareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
            }
        });
    };

    const handleSaveBookmark = async () => {
        if (!websiteInfo) return;

        const websiteSuggestion = {
            title: websiteInfo.title,
            url: websiteInfo.url,
            description: websiteInfo.description,
            tags: websiteInfo.tags || [],
            suggestedFolderPath: websiteInfo.suggestedFolderPath,
        };

        const { data: validWebsiteSuggestion, error } = WebsiteSuggestionSchema.safeParse(websiteSuggestion);

        if (error) {
            console.error('Validation error:', error);
            toast.error('Invalid website data. Please try again.');
            return;
        }

        toast.promise(
            saveBookmark({
                websiteSuggestion: validWebsiteSuggestion,
                selectedFolderPath,
                selectedFolderColor: selectedColor,
            }),
            {
                loading: 'Saving bookmark...',
                success: 'Bookmark saved successfully!',
                error: 'Failed to save bookmark.',
                invert: true,
            },
        );
    };

    const canContinue = () => {
        if (step === 'url') return url.trim() !== '';
        if (step === 'folder') return selectedFolderPath.length > 0;
        return true;
    };

    const handleNext = () => {
        if (step === 'url') {
            handleGetWebsiteInfo();
        } else if (step === 'folder') {
            setStep('color');
        }
    };

    // Step Components
    const STEP_COMPONENTS: Record<Step, React.FC> = {
        url: () => (
            <div className='space-y-3'>
                <Label htmlFor='url'>Website URL</Label>
                <Input
                    id='url'
                    type='url'
                    placeholder='https://example.com'
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && canContinue()) {
                            handleNext();
                        }
                    }}
                />
                <p className='text-sm text-gray-500'>
                    Enter a website URL and we'll automatically get its title and description using AI.
                </p>
            </div>
        ),

        folder: () => (
            <div className='space-y-3'>
                {websiteInfo?.description && (
                    <div className='p-3 bg-gray-50 rounded-md'>
                        <div className='flex items-start gap-2'>
                            {isEditingDescription ? (
                                <div className='flex-1 space-y-2'>
                                    <Textarea
                                        ref={descriptionTextareaRef}
                                        value={editableDescription}
                                        onChange={handleDescriptionChange}
                                        className='resize-none'
                                        rows={3}
                                        autoFocus
                                        onFocus={(e) => e.stopPropagation()}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => {
                                            e.stopPropagation();
                                            if (e.key === 'Enter' && e.ctrlKey) {
                                                handleSaveDescription();
                                            }
                                            if (e.key === 'Escape') {
                                                handleCancelDescriptionEdit();
                                            }
                                        }}
                                    />
                                    <div className='grid grid-cols-2 gap-2'>
                                        <Button size='sm' onClick={handleSaveDescription}>
                                            <Check className='w-4 h-4' />
                                        </Button>
                                        <Button size='sm' variant='outline' onClick={handleCancelDescriptionEdit}>
                                            <X className='w-4 h-4' />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className='text-sm text-gray-700 flex-1'>{websiteInfo.description}</p>
                                    <Button
                                        size='sm'
                                        variant='ghost'
                                        onClick={() => setIsEditingDescription(true)}
                                        className='p-1 h-auto'
                                    >
                                        <Edit3 className='w-3 h-3' />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}
                {foldersAndBookmarks && (
                    <BookmarkTree
                        data={foldersAndBookmarks}
                        onFolderSelect={(ARGS) => {
                            console.log('Got Here 1');
                            setSelectedFolderPath(ARGS);
                            console.log('Got Here 2');
                        }}
                    />
                )}
            </div>
        ),

        color: () => (
            <div className='space-y-3'>
                {websiteInfo?.description && (
                    <div className='p-3 bg-gray-50 rounded-md'>
                        <div className='flex items-start gap-2'>
                            <p className='text-sm text-gray-700 flex-1'>{websiteInfo.description}</p>
                        </div>
                    </div>
                )}
                <div className='flex items-center gap-4'>
                    <ColorPicker
                        value={selectedColor}
                        onChange={setSelectedColor}
                        className='w-full rounded-md border bg-background p-4'
                    />
                </div>
            </div>
        ),
    };

    const CurrentStepComponent = STEP_COMPONENTS[step];

    return (
        <DialogContent className='flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:hidden'>
            <DialogHeader className='contents space-y-0 text-left'>
                <DialogTitle className='border-b px-6 py-4 text-base'>
                    <div className='flex justify-between w-full gap-2'>
                        <div className='flex gap-0 flex-col'>
                            <div className='flex gap-2 items-center'>
                                {websiteInfo ? (
                                    <>
                                        <WebsiteLogo className='size-4' url={websiteInfo.url} />
                                        {isEditingTitle ? (
                                            <div className='flex items-center gap-2'>
                                                <Input
                                                    ref={titleInputRef}
                                                    value={editableTitle}
                                                    onChange={handleTitleChange}
                                                    className='text-base h-6 border-none p-0 focus-visible:ring-0'
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleSaveTitle();
                                                        if (e.key === 'Escape') handleCancelTitleEdit();
                                                    }}
                                                />
                                                <Button size='sm' onClick={handleSaveTitle} className='p-1 h-auto'>
                                                    <Check className='w-3 h-3' />
                                                </Button>
                                                <Button
                                                    size='sm'
                                                    variant='outline'
                                                    onClick={handleCancelTitleEdit}
                                                    className='p-1 h-auto'
                                                >
                                                    <X className='w-3 h-3' />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className='flex items-center gap-2'>
                                                <p className='text-base leading-none'>{websiteInfo.title}</p>
                                                <Button
                                                    size='sm'
                                                    variant='ghost'
                                                    onClick={() => setIsEditingTitle(true)}
                                                    className='p-1 h-auto'
                                                >
                                                    <Edit3 className='w-3 h-3' />
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Globe className='size-4' />
                                        <p className='text-base leading-none'>Create New Bookmark</p>
                                    </>
                                )}
                            </div>
                            {websiteInfo && <p className='text-sm font-thin text-gray-500'>{websiteInfo.url}</p>}
                        </div>
                        <p className='text-sm italic text-gray-500'>{STEP_CONFIG[step].title}</p>
                    </div>
                </DialogTitle>

                <div className='overflow-y-auto'>
                    <DialogDescription asChild>
                        <GroupMotionHighlight>
                            <div className='px-6 py-4 space-y-4'>
                                <CurrentStepComponent />
                            </div>
                        </GroupMotionHighlight>
                    </DialogDescription>
                </div>

                <DialogFooter className='border-t px-6 py-4 flex items-center justify-between w-full'>
                    <div className='flex items-center justify-between w-full'>
                        <div className='flex items-center gap-2 text-xs text-purple-500 truncate max-w-[60%]'>
                            {selectedFolderPath.length > 0 && step !== 'url' && (
                                <>
                                    <Folder className='w-3.5 h-3.5 shrink-0' style={{ color: selectedColor }} />
                                    <span className='truncate' style={{ color: selectedColor }}>
                                        {isMobile ? selectedFolderPath.at(-1) : selectedFolderPath.join(' \\ ')}
                                    </span>
                                </>
                            )}
                        </div>

                        <div className='flex gap-2'>
                            {step !== 'url' && (
                                <Button
                                    type='button'
                                    variant='ghost'
                                    onClick={() => {
                                        if (step === 'color') setStep('folder');
                                        else if (step === 'folder') setStep('url');
                                    }}
                                >
                                    Back
                                </Button>
                            )}

                            {step === 'url' ? (
                                <Button
                                    type='button'
                                    onClick={handleNext}
                                    disabled={!canContinue() || isLoadingWebsiteInfo}
                                >
                                    {isLoadingWebsiteInfo && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                                    {isLoadingWebsiteInfo ? 'Analyzing...' : 'Next'}
                                </Button>
                            ) : step === 'folder' ? (
                                <Button type='button' onClick={handleNext} disabled={!canContinue()}>
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
