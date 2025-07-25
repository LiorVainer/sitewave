import { RedirectToSignIn, SignedOut } from '@clerk/nextjs';

export default function NotFoundPage() {
    return (
        <SignedOut>
            <RedirectToSignIn />
        </SignedOut>
    );
}
