'use client';

import { createContext, ReactNode, useContext } from 'react';
import { useConvexAuth } from 'convex/react';
import { useGuestSession } from '@/hooks/use-guest-session';
import { Id } from '@convex/dataModel';

interface UserContextType {
    // Authentication state
    isAuthenticated: boolean;
    isLoading: boolean;

    // Guest session management
    guestId: Id<'guests'> | null;
    sessionId: string;
    isCreatingGuest: boolean;
    ensureGuestExists: () => Promise<Id<'guests'>>;

    // Computed user identifier for queries
    userId: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
    const { guestId, sessionId, isCreatingGuest, ensureGuestExists } = useGuestSession();

    // Compute the user identifier for Convex queries
    const userId = isAuthenticated ? null : guestId; // For authenticated users, Convex uses identity.subject internally

    const contextValue: UserContextType = {
        isAuthenticated,
        isLoading: isAuthLoading || isCreatingGuest,
        guestId,
        sessionId,
        isCreatingGuest,
        ensureGuestExists,
        userId,
    };

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
