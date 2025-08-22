'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/animate-ui/radix/tabs';
import { PackageForm } from './PackageForm';
import { PackageInfo } from './PackageInfo';
import { DownloadsChart } from './DownloadsChart';
import { DependenciesList } from './DependenciesList';
import { DependentsList } from './DependentsList';
import { VersionsList } from './VersionsList';
import { ErrorDisplay } from './ErrorDisplay';
import { npmPackageService } from '@/services/npm-package.service';
import type { NpmPackageResponse } from '@/models/npm-package.model';

export function NpmPackage() {
    const [packageName, setPackageName] = useState('');
    const [packageData, setPackageData] = useState<NpmPackageResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!packageName.trim()) return;

        setLoading(true);
        setError(null);
        setPackageData(null);

        try {
            const data = await npmPackageService.getPackage(packageName.trim());
            setPackageData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-4 md:p-6 lg:px-24 lg:py-10 space-y-4 md:space-y-6 flex flex-col flex-1 h-full w-full overflow-hidden'>
            <PackageForm
                packageName={packageName}
                onPackageNameChange={setPackageName}
                onSubmit={handleSubmit}
                loading={loading}
            />

            {error && <ErrorDisplay error={error} />}

            {packageData && !loading && (
                <Tabs defaultValue='overview' className='overflow-hidden'>
                    <TabsList className='grid w-full grid-cols-5'>
                        <TabsTrigger value='overview' className='text-sm md:text-base'>
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value='downloads' className='text-sm md:text-base'>
                            Downloads
                        </TabsTrigger>
                        <TabsTrigger value='dependencies' className='text-sm md:text-base'>
                            Dependencies
                        </TabsTrigger>
                        <TabsTrigger value='dependents' className='text-sm md:text-base'>
                            Dependents
                        </TabsTrigger>
                        <TabsTrigger value='versions' className='text-sm md:text-base'>
                            Versions
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value='overview' className='mt-4 md:mt-6 overflow-y-auto w-full overflow-x-hidden'>
                        <PackageInfo packageData={packageData} />
                    </TabsContent>

                    <TabsContent value='downloads' className='mt-4 md:mt-6 overflow-y-auto w-full overflow-x-hidden'>
                        <DownloadsChart
                            dailyDownloads={packageData.dailyDownloadsLastMonth}
                            packageName={packageData.packageName}
                        />
                    </TabsContent>

                    <TabsContent value='dependencies' className='mt-4 md:mt-6 overflow-y-auto w-full overflow-x-hidden'>
                        <DependenciesList dependencies={packageData.dependencies} />
                    </TabsContent>

                    <TabsContent value='dependents' className='mt-4 md:mt-6 overflow-y-auto w-full overflow-x-hidden'>
                        <DependentsList dependents={packageData.dependents} />
                    </TabsContent>

                    <TabsContent value='versions' className='mt-4 md:mt-6 overflow-y-auto w-full overflow-x-hidden'>
                        <VersionsList versions={packageData.versions} />
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}
