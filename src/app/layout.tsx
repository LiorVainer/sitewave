import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppSidebar } from '@/components/AppSidebar';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

// eslint-disable-next-line react-refresh/only-export-components
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
                <AppSidebar>{children}</AppSidebar>
            </body>
        </html>
    );
}
