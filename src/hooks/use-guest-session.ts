'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';
import { useConvexAuth, useMutation } from 'convex/react';
import { api } from '@convex/api';
import { Id } from '@convex/dataModel';
import { useEffect, useState } from 'react';

export const useGuestSession = () => {
    const { isAuthenticated } = useConvexAuth();
    const [sessionId, setSessionId] = useLocalStorage('guest-session-id', '');
    const [guestId, setGuestId] = useLocalStorage<Id<'guests'> | null>('guest-id', null);
    const [isCreatingGuest, setIsCreatingGuest] = useState(false);

    const createNewGuest = useMutation(api.guests.createNewGuest);

    // Generate session ID if none exists
    useEffect(() => {
        if (!sessionId) {
            const newSessionId = crypto.randomUUID();
            setSessionId(`guest-${newSessionId}`);
        }
    }, [sessionId, setSessionId]);

    const createGuest = async () => {
        setIsCreatingGuest(true);
        try {
            const newGuestId = await createNewGuest({ sessionId });
            setGuestId(newGuestId);
        } catch (error) {
            console.error('Error creating guest:', error);
        } finally {
            setIsCreatingGuest(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated && !guestId && sessionId && !isCreatingGuest) {
            createGuest();
        }
    }, [isAuthenticated, guestId, sessionId, isCreatingGuest, createNewGuest, setGuestId]);

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
        } catch (error) {
            console.error('Error creating guest:', error);
            throw error;
        } finally {
            setIsCreatingGuest(false);
        }
    };

    return {
        guestId,
        sessionId,
        ensureGuestExists,
        isCreatingGuest,
        isAuthenticated,
    };
};
