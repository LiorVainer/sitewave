'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Version } from '@/models/npm-package.model';

interface VersionsListProps {
    versions: Version[];
}

export function VersionsList({ versions }: VersionsListProps) {
    const [showAll, setShowAll] = useState(false);
    const displayVersions = showAll ? versions : versions.slice(0, 10);

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(date);
    };

    if (versions.length === 0) {
        return (
            <Card>
                <CardHeader className='pb-4 md:pb-6'>
                    <CardTitle className='text-lg md:text-xl'>Version History</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-muted-foreground'>No version history available.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className='pb-4 md:pb-6'>
                <CardTitle className='flex items-center justify-between text-lg md:text-xl'>
                    <span>Version History</span>
                    <Badge variant='outline' className='text-xs'>
                        {versions.length} versions
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='space-y-3'>
                    {displayVersions.map((version, index) => (
                        <div
                            key={index}
                            className='flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted/50 rounded-md gap-2'
                        >
                            <div className='flex items-center gap-2'>
                                <Badge variant='secondary' className='text-xs'>
                                    {version.version}
                                </Badge>
                                <span className='text-sm text-muted-foreground'>{formatDate(version.published)}</span>
                            </div>
                            <div className='text-sm font-medium'>{formatNumber(version.downloads)} downloads</div>
                        </div>
                    ))}

                    {versions.length > 10 && (
                        <div className='flex justify-center pt-2'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setShowAll(!showAll)}
                                className='flex items-center gap-2'
                            >
                                {showAll ? (
                                    <>
                                        Show Less <ChevronUp size={16} />
                                    </>
                                ) : (
                                    <>
                                        Show All ({versions.length - 10} more) <ChevronDown size={16} />
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
