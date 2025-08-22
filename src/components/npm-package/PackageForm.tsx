'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PackageFormProps {
    packageName: string;
    onPackageNameChange: (packageName: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
}

export function PackageForm({ packageName, onPackageNameChange, onSubmit, loading }: PackageFormProps) {
    return (
        <Card>
            <CardHeader className='pb-4 md:pb-6'>
                <CardTitle className='text-lg md:text-xl'>NPM Package Explorer</CardTitle>
                <CardDescription className='text-sm md:text-base'>
                    Explore detailed information from npmjs.com for any package
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className='flex flex-col sm:flex-row gap-2'>
                    <div className='flex-1'>
                        <Input
                            type='text'
                            placeholder='Enter package name (e.g., react, lodash, express)'
                            value={packageName}
                            onChange={(e) => onPackageNameChange(e.target.value)}
                            disabled={loading}
                            className='text-sm md:text-base'
                            autoComplete='off'
                        />
                    </div>
                    <Button type='submit' disabled={loading || !packageName.trim()} className='w-full sm:w-auto'>
                        {loading ? 'Loading...' : 'Explore Package'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
