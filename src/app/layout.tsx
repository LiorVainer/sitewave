import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import ConvexClientProvider from '@/context/ConvexClientProvider';
import { ClientLayoutWrapper } from '@/components/layout/ClientLayoutWrapper';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Sitewave',
    description: 'A modern, full-stack web development platform',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden`}>
                <ClerkProvider>
                    <ConvexClientProvider>
                        <NuqsAdapter>
                            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
                        </NuqsAdapter>
                    </ConvexClientProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
