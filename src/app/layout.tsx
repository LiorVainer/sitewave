import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import ConvexClientProvider from '@/context/ConvexClientProvider';

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
                <ClerkProvider signInUrl={'/login'} afterSignOutUrl={'/login'}>
                    <ConvexClientProvider>{children}</ConvexClientProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
