'use client';

import { Button } from '@/components/ui/button';

interface LoadMoreThreadsButtonProps {
    onLoadMore: () => void;
    canLoadMore: boolean;
}

export const LoadMoreThreadsButton = ({ onLoadMore, canLoadMore }: LoadMoreThreadsButtonProps) => {
    if (!canLoadMore) return null;

    return <Button onClick={onLoadMore}>Load more chats</Button>;
};
