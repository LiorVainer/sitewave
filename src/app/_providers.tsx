// app/_providers.tsx
'use client';

import { ClerkProvider } from '@clerk/nextjs';
import ConvexClientProvider from '@/context/ConvexClientProvider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ClientLayoutWrapper } from '@/components/layout/ClientLayoutWrapper';
import { ThemeProvider } from '@/components/theme-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <ConvexClientProvider>
                <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
                    <NuqsAdapter>
                        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
                    </NuqsAdapter>
                </ThemeProvider>
            </ConvexClientProvider>
        </ClerkProvider>
    );
}
