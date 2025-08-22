'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Dependent } from '@/models/npm-package.model';

interface DependentsListProps {
    dependents: Dependent[];
}

export function DependentsList({ dependents }: DependentsListProps) {
    if (dependents.length === 0) {
        return (
            <Card>
                <CardHeader className='pb-4 md:pb-6'>
                    <CardTitle className='text-lg md:text-xl'>Dependents</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-muted-foreground'>No packages depend on this one.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className='pb-4 md:pb-6'>
                <CardTitle className='flex items-center justify-between text-lg md:text-xl'>
                    <span>Dependents</span>
                    <Badge variant='outline' className='text-xs'>
                        {dependents.length} shown
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
                    {dependents.map((dependent, index) => (
                        <a
                            key={index}
                            href={`https://www.npmjs.com/package/${dependent.name}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='block'
                        >
                            <Badge
                                variant='outline'
                                className='w-full justify-center hover:bg-accent cursor-pointer transition-colors text-xs py-1'
                            >
                                {dependent.name}
                            </Badge>
                        </a>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
