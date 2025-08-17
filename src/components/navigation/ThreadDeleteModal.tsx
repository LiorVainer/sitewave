'use client';

import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MessageSquare, Trash2 } from 'lucide-react';
import { formatCreationTime } from '@/lib/date';

export type ThreadDeleteModalProps = {
    thread: {
        _id: string;
        title: string;
        summary?: string;
        creationTime: number;
    };
    onConfirm: () => Promise<void>;
};

export const ThreadDeleteModal = ({ thread, onConfirm }: ThreadDeleteModalProps) => {
    const handleDelete = async () => {
        toast.promise(onConfirm(), {
            loading: 'Deleting thread...',
            success: 'Thread deleted successfully!',
            error: 'Failed to delete thread.',
            invert: true,
        });
    };

    return (
        <DialogContent className='flex flex-col gap-0 p-0 sm:max-w-md [&>button:last-child]:hidden'>
            <DialogHeader className='contents space-y-0 text-left'>
                <DialogTitle className='border-b px-6 py-4 text-base flex items-center gap-3'>
                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10'>
                        <Trash2 size={20} className='text-destructive' />
                    </div>
                    <div>
                        <p className='text-base font-semibold'>Delete Thread</p>
                        <p className='text-sm font-normal text-muted-foreground'>This action cannot be undone</p>
                    </div>
                </DialogTitle>

                <div className='px-6 py-4'>
                    <DialogDescription asChild>
                        <div className='space-y-4'>
                            <div className='p-4 rounded-lg bg-muted border'>
                                <div className='flex items-start gap-3'>
                                    <MessageSquare size={16} className='flex-shrink-0 mt-0.5 text-muted-foreground' />
                                    <div className='flex flex-col min-w-0 flex-1'>
                                        <span className='text-sm font-medium truncate'>{thread.title}</span>
                                        <div className='flex items-center gap-1 text-xs text-muted-foreground mt-1'>
                                            <span>{formatCreationTime(thread.creationTime)}</span>
                                        </div>
                                        {thread.summary && (
                                            <p className='text-xs text-muted-foreground mt-2 line-clamp-2'>
                                                {thread.summary}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <p className='text-sm text-muted-foreground'>
                                Are you sure you want to delete this thread? All messages and suggestions in this thread
                                will be permanently removed.
                            </p>
                        </div>
                    </DialogDescription>
                </div>

                <DialogFooter className='border-t px-6 py-4 flex items-center justify-between w-full'>
                    <div className='flex gap-2 w-full justify-end'>
                        <DialogClose asChild>
                            <Button type='button' variant='ghost'>
                                Cancel
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type='button' variant='destructive' onClick={handleDelete}>
                                Delete Thread
                            </Button>
                        </DialogClose>
                    </div>
                </DialogFooter>
            </DialogHeader>
        </DialogContent>
    );
};
