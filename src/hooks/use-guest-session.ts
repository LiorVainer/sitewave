'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';
import { useMutation } from 'convex/react';
import { api } from '@convex/api';
import { Id } from '@convex/dataModel';
import { useEffect, useState } from 'react';

export const useGuestSession = () => {
    const [sessionId, setSessionId] = useLocalStorage('guest-session-id', '');
    const [guestId, setGuestId] = useLocalStorage<Id<'guests'> | null>('guest-id', null);
    const [isCreatingGuest, setIsCreatingGuest] = useState(false);

    const createNewGuest = useMutation(api.guests.createNewGuest);

    useEffect(() => {
        if (!sessionId) {
            const newSessionId = crypto.randomUUID();
            setSessionId(`anonymous:${newSessionId}`);
        }
    }, [sessionId, setSessionId]);

    const ensureGuestExists = async (): Promise<Id<'guests'>> => {
        if (guestId) return guestId;

        if (isCreatingGuest) {
            while (!guestId) {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
            return guestId;
        }

        setIsCreatingGuest(true);
        try {
            const newGuestId = await createNewGuest({ sessionId });
            setGuestId(newGuestId);
            return newGuestId;
        } finally {
            setIsCreatingGuest(false);
        }
    };

    return {
        guestId,
        sessionId,
        ensureGuestExists,
        isCreatingGuest,
    };
};
