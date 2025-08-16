// app/_providers.tsx
'use client';

import { ClerkProvider } from '@clerk/nextjs';
import ConvexClientProvider from '@/context/ConvexClientProvider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ClientLayoutWrapper } from '@/components/layout/ClientLayoutWrapper';

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <ConvexClientProvider>
                <NuqsAdapter>
                    <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
                </NuqsAdapter>
            </ConvexClientProvider>
        </ClerkProvider>
    );
}
