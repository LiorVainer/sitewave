import { AppSidebar } from '@/components/AppSidebar';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/nextjs';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <SignedIn>
                <AppSidebar>{children}</AppSidebar>;
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
}
