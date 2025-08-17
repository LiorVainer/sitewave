// app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import { AppProviders } from './_providers';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sitewave.app';

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl), // ✅ expands relative URLs
    title: 'Sitewave',
    description: 'A modern, full-stack web development platform',
    openGraph: {
        title: 'Sitewave',
        description: 'AI-powered website discovery and bookmarking assistant',
        images: ['/og.png'],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden`}>
                <Suspense fallback={null}>
                    <AppProviders>{children}</AppProviders>
                </Suspense>
            </body>
        </html>
    );
}
