'use client';

import { useState } from 'react';
import { useAction, usePaginatedQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { api } from '@convex/api';
import { useWebsiteSuggestions } from '@/context/WebsiteSuggestionsContext';
import { useUser } from '@/context/UserContext';
import { Id } from '@convex/dataModel';
import { useIsMobile } from './use-mobile';
import { useSidebar } from '@/components/animate-ui/radix/sidebar';

export const THREADS_PAGE_SIZE = 10;

export const useThreadsData = () => {
    const { currentThreadId, setCurrentThreadId } = useWebsiteSuggestions();
    const { guestId, isAuthenticated, isCreatingGuest } = useUser();
    const router = useRouter();
    const deleteThread = useAction(api.threads.deleteThread);
    const { toggleSidebar } = useSidebar();
    const isMobile = useIsMobile();

    const [threadToDelete, setThreadToDelete] = useState<any>(null);

    const shouldSkipQuery = !isAuthenticated && isCreatingGuest;

    const {
        results: threads,
        status,
        loadMore,
    } = usePaginatedQuery(
        api.threads.listThreads,
        shouldSkipQuery ? 'skip' : { guestId: (guestId as Id<'guests'>) || undefined },
        { initialNumItems: THREADS_PAGE_SIZE },
    );

    const handleThreadSelect = (selectedThreadId: string) => {
        if (isMobile) {
            toggleSidebar();
        }
        router.push(`/?threadId=${selectedThreadId}`);
    };

    const handleDelete = (threadId: string) => {
        const threadData = threads?.find((t) => t._id === threadId);
        if (threadData) {
            setThreadToDelete(threadData);
        }
    };

    const confirmDelete = async () => {
        if (!threadToDelete) return;
        try {
            await deleteThread({ threadId: threadToDelete._id });
            if (currentThreadId === threadToDelete._id) {
                setCurrentThreadId(null);
            }
            setThreadToDelete(null);
        } catch (err) {
            console.error(err);
            throw new Error('Failed to delete thread');
        }
    };

    const cancelDelete = () => {
        setThreadToDelete(null);
    };

    const loadMoreThreads = () => {
        if (status === 'CanLoadMore') {
            loadMore(THREADS_PAGE_SIZE);
        }
    };

    return {
        threads,
        status,
        currentThreadId,
        threadToDelete,
        handleThreadSelect,
        handleDelete,
        confirmDelete,
        cancelDelete,
        loadMoreThreads,
        isLoading: shouldSkipQuery,
    };
};
