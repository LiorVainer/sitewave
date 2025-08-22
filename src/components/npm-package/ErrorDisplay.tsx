'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
    error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
    return (
        <Card className='border-destructive'>
            <CardContent className='pt-4 md:pt-6'>
                <div className='flex items-center gap-2 text-destructive'>
                    <AlertCircle size={16} />
                    <p className='text-sm md:text-base'>{error}</p>
                </div>
            </CardContent>
        </Card>
    );
}
