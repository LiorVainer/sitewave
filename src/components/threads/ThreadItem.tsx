'use client';

import { useState } from 'react';
import { useAction } from 'convex/react';
import { SidebarMenuButton } from '@/components/animate-ui/radix/sidebar';
import { Check, Edit3, MessageSquare, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCreationTime } from '@/lib/date';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { api } from '@convex/api';
import { Id } from '@convex/dataModel';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';

interface ThreadItemProps {
    thread: {
        _id: string;
        title: string;
        summary?: string;
        creationTime: number;
    };
    isActive: boolean;
    onSelect: (threadId: string) => void;
    onDelete: (threadId: string) => void;
}

export const ThreadItem = ({ thread, isActive, onSelect, onDelete }: ThreadItemProps) => {
    const { guestId } = useUser();
    const [isRenaming, setIsRenaming] = useState(false);
    const [renameValue, setRenameValue] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const renameThreadMutation = useAction(api.threads.renameThread);

    const handleRename = () => {
        setIsRenaming(true);
        setRenameValue(thread.title);
    };

    const handleConfirmRename = async () => {
        if (renameValue.trim() && renameValue !== thread.title) {
            try {
                await renameThreadMutation({
                    threadId: thread._id,
                    newTitle: renameValue.trim(),
                    guestId: (guestId as Id<'guests'>) || undefined,
                });
            } catch (error) {
                console.error('Error renaming thread:', error);
            }
        }
        setIsRenaming(false);
        setRenameValue('');
    };

    const handleCancelRename = () => {
        setIsRenaming(false);
        setRenameValue('');
    };

    if (isRenaming) {
        return (
            <div className='flex items-center gap-2 p-2'>
                <Input
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    className='flex-1 text-sm'
                    placeholder='Thread title'
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleConfirmRename();
                        if (e.key === 'Escape') handleCancelRename();
                    }}
                />
                <div className='flex gap-1'>
                    <Button onClick={handleConfirmRename} size='sm' variant='outline' className='p-2'>
                        <Check className='size-4' />
                    </Button>
                    <Button onClick={handleCancelRename} size='sm' variant='outline' className='p-2'>
                        <X className='size-4' />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <SidebarMenuButton
                    onClick={() => onSelect(thread._id)}
                    className={cn(
                        'w-full justify-start gap-4 h-auto py-2 cursor-pointer relative',
                        isActive && 'bg-accent text-accent-foreground',
                    )}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    tooltip={thread.summary || thread.title}
                >
                    <motion.div
                        aria-label='Delete thread'
                        title='Delete'
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(thread._id);
                        }}
                        className='hidden md:absolute md:block right-2 top-1/2 md:-translate-y-1/2 z-50 dark:bg-background bg-white rounded-md shadow-md'
                        initial={{ opacity: 0 }}
                        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        <Button variant='outline' size='icon'>
                            <Trash2 size={16} className='text-muted-foreground md:text-destructive' />
                        </Button>
                    </motion.div>
                    <MessageSquare size={16} className='flex-shrink-0' />
                    <div className='flex flex-col items-start text-left min-w-0 flex-1'>
                        <span className='text-sm font-normal truncate w-full'>{thread.title}</span>
                        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                            <span>{formatCreationTime(thread.creationTime)}</span>
                        </div>
                    </div>
                </SidebarMenuButton>
            </ContextMenuTrigger>
            <ContextMenuContent className='w-48'>
                <ContextMenuItem onClick={handleRename}>
                    <Edit3 className='mr-2 size-4' />
                    Rename thread
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                    onClick={() => onDelete(thread._id)}
                    className='text-destructive focus:text-destructive'
                >
                    <Trash2 className='mr-2 size-4' />
                    Delete thread
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};
