// app/layout.tsx
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import { AppProviders } from './_providers';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const VERSION = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? Date.now().toString();

export async function generateMetadata() {
    return {
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
        openGraph: {
            images: [`/og.png?v=${VERSION}`],
        },
        twitter: {
            images: [`/og.png?v=${VERSION}`],
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
