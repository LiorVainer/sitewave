'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NotFoundPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/');
    }, [router]);

    return <p className='text-center mt-10'>Redirecting to home...</p>;
}
