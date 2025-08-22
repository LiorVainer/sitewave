'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Dependency } from '@/models/npm-package.model';

interface DependenciesListProps {
    dependencies: Dependency[];
}

export function DependenciesList({ dependencies }: DependenciesListProps) {
    if (dependencies.length === 0) {
        return (
            <Card>
                <CardHeader className='pb-4 md:pb-6'>
                    <CardTitle className='text-lg md:text-xl'>Dependencies</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-muted-foreground'>This package has no dependencies.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className='pb-4 md:pb-6'>
                <CardTitle className='flex items-center justify-between text-lg md:text-xl'>
                    <span>Dependencies</span>
                    <Badge variant='outline' className='text-xs'>
                        {dependencies.length} total
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
                    {dependencies.map((dependency, index) => (
                        <a
                            key={index}
                            href={`https://www.npmjs.com/package/${dependency.name}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='block'
                        >
                            <Badge
                                variant='secondary'
                                className='w-full justify-center hover:bg-secondary/80 cursor-pointer transition-colors text-xs py-1'
                            >
                                {dependency.name}
                            </Badge>
                        </a>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
