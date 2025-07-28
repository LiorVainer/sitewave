import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import ConvexClientProvider from '@/context/ConvexClientProvider';
import { ClientLayoutWrapper } from '@/components/layout/ClientLayoutWrapper';

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
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
                <ClerkProvider>
                    <ConvexClientProvider>
                        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
                    </ConvexClientProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
