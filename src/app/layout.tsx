// app/layout.tsx
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import { AppProviders } from './_providers';
import { Metadata } from 'next';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const VERSION = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? Date.now().toString();

export async function generateMetadata(): Promise<Metadata> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sitewave.app';
    const title = 'Sitewave';
    const description = 'Discover, organize, and manage websites bookmarks with AI-powered suggestions';
    const ogImage = `/og.png?v=${VERSION}`;

    return {
        title,
        description,
        metadataBase: new URL(siteUrl),
        openGraph: {
            type: 'website',
            url: siteUrl,
            title,
            description,
            siteName: 'Sitewave',
            locale: 'en_US',
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: 'Sitewave preview image',
                    type: 'image/png',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [
                {
                    url: ogImage,
                    alt: 'Sitewave preview image',
                },
            ],
        },
    };
}

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
