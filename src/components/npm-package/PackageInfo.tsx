'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import type { NpmPackageResponse } from '@/models/npm-package.model';

interface PackageInfoProps {
    packageData: NpmPackageResponse;
}

export function PackageInfo({ packageData }: PackageInfoProps) {
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

    return (
        <Card>
            <CardHeader className='pb-4 md:pb-6'>
                <CardTitle className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-lg md:text-xl'>
                    <span>Package Overview</span>
                    <Badge variant='outline' className='text-xs self-start sm:self-center'>
                        {formatNumber(packageData.weeklyDownloads)} weekly downloads
                    </Badge>
                </CardTitle>
                <CardDescription className='text-sm md:text-base'>
                    Key information about {packageData.packageName}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-3'>
                        <div>
                            <h4 className='text-sm font-medium text-muted-foreground mb-1'>Weekly Downloads</h4>
                            <p className='text-lg font-semibold text-green-600'>
                                {formatNumber(packageData.weeklyDownloads)}
                            </p>
                        </div>

                        <div>
                            <h4 className='text-sm font-medium text-muted-foreground mb-1'>Last Published</h4>
                            <p className='text-sm'>{formatDate(packageData.lastPublish)}</p>
                        </div>
                    </div>

                    <div className='space-y-3'>
                        <div>
                            <h4 className='text-sm font-medium text-muted-foreground mb-1'>Repository</h4>
                            {packageData.githubLink ? (
                                <a
                                    href={packageData.githubLink}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-primary hover:underline flex items-center gap-1 text-sm'
                                >
                                    View on GitHub
                                    <ExternalLink size={12} />
                                </a>
                            ) : (
                                <p className='text-sm text-muted-foreground'>Not available</p>
                            )}
                        </div>

                        <div className='grid grid-cols-2 gap-2 text-center'>
                            <div className='p-2 bg-muted rounded-md'>
                                <p className='text-sm font-medium'>{packageData.dependencyCount}</p>
                                <p className='text-xs text-muted-foreground'>Dependencies</p>
                            </div>
                            <div className='p-2 bg-muted rounded-md'>
                                <p className='text-sm font-medium'>{packageData.dependentCount}</p>
                                <p className='text-xs text-muted-foreground'>Dependents</p>
                            </div>
                            <div className='p-2 bg-muted rounded-md'>
                                <p className='text-sm font-medium'>{packageData.versions.length}</p>
                                <p className='text-xs text-muted-foreground'>Versions</p>
                            </div>
                            <div className='p-2 bg-muted rounded-md'>
                                <p className='text-sm font-medium'>{packageData.dailyDownloadsLastMonth.length}</p>
                                <p className='text-xs text-muted-foreground'>Days Data</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
