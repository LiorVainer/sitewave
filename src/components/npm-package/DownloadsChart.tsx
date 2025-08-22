'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DailyDownload } from '@/models/npm-package.model';

interface DownloadsChartProps {
    dailyDownloads: DailyDownload[];
    packageName: string;
}

export function DownloadsChart({ dailyDownloads, packageName }: DownloadsChartProps) {
    if (!dailyDownloads || dailyDownloads.length === 0) {
        return (
            <Card>
                <CardHeader className='pb-4 md:pb-6'>
                    <CardTitle className='text-lg md:text-xl'>Downloads Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-muted-foreground'>No download data available for the last month.</p>
                </CardContent>
            </Card>
        );
    }

    // Sort data by date to ensure proper chronological order
    const sortedData = [...dailyDownloads].sort((a, b) => a.day.localeCompare(b.day));

    // Calculate dimensions and scales
    const width = 800;
    const height = 300;
    const padding = { top: 20, right: 30, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Get min/max values for scaling
    const maxDownloads = Math.max(...sortedData.map((d) => d.downloads));
    const minDownloads = Math.min(...sortedData.map((d) => d.downloads));
    const downloadRange = maxDownloads - minDownloads || 1; // Avoid division by zero

    // Format numbers for display
    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    // Create path for the line chart
    const createPath = (data: DailyDownload[]) => {
        return data
            .map((point, index) => {
                const x = (index / (data.length - 1)) * chartWidth;
                const y = chartHeight - ((point.downloads - minDownloads) / downloadRange) * chartHeight;
                return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
            })
            .join(' ');
    };

    // Create area path for filled area under the line
    const createAreaPath = (data: DailyDownload[]) => {
        const linePath = createPath(data);
        const firstX = 0;
        const lastX = chartWidth;

        return `${linePath} L ${lastX} ${chartHeight} L ${firstX} ${chartHeight} Z`;
    };

    // Generate Y-axis ticks
    const yTicks = 5;
    const yTickValues = Array.from({ length: yTicks }, (_, i) => {
        return minDownloads + (downloadRange * i) / (yTicks - 1);
    });

    // Generate X-axis ticks (show every 7th day approximately)
    const xTickIndices = sortedData.map((_, i) => i).filter((_, i) => i % Math.ceil(sortedData.length / 5) === 0);

    const path = createPath(sortedData);
    const areaPath = createAreaPath(sortedData);

    return (
        <Card>
            <CardHeader className='pb-4 md:pb-6'>
                <CardTitle className='text-lg md:text-xl'>Downloads Trend (Last Month)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='w-full overflow-x-auto'>
                    <svg
                        width={width}
                        height={height}
                        className='w-full h-auto max-w-full'
                        viewBox={`0 0 ${width} ${height}`}
                    >
                        {/* Chart background */}
                        <rect
                            x={padding.left}
                            y={padding.top}
                            width={chartWidth}
                            height={chartHeight}
                            fill='transparent'
                            stroke='currentColor'
                            strokeOpacity={0.1}
                        />

                        {/* Grid lines */}
                        {yTickValues.map((value, i) => {
                            const y =
                                padding.top + chartHeight - ((value - minDownloads) / downloadRange) * chartHeight;
                            return (
                                <g key={`grid-${i}`}>
                                    <line
                                        x1={padding.left}
                                        y1={y}
                                        x2={padding.left + chartWidth}
                                        y2={y}
                                        stroke='currentColor'
                                        strokeOpacity={0.1}
                                        strokeDasharray='2,2'
                                    />
                                </g>
                            );
                        })}

                        {/* Area fill */}
                        <path
                            d={areaPath}
                            fill='hsl(var(--primary))'
                            fillOpacity={0.1}
                            transform={`translate(${padding.left}, ${padding.top})`}
                        />

                        {/* Line chart */}
                        <path
                            d={path}
                            fill='none'
                            stroke='hsl(var(--primary))'
                            strokeWidth={2}
                            transform={`translate(${padding.left}, ${padding.top})`}
                        />

                        {/* Data points */}
                        {sortedData.map((point, index) => {
                            const x = padding.left + (index / (sortedData.length - 1)) * chartWidth;
                            const y =
                                padding.top +
                                chartHeight -
                                ((point.downloads - minDownloads) / downloadRange) * chartHeight;

                            return (
                                <circle
                                    key={`point-${index}`}
                                    cx={x}
                                    cy={y}
                                    r={3}
                                    fill='hsl(var(--primary))'
                                    className='hover:r-4 transition-all cursor-pointer'
                                >
                                    <title>
                                        {point.day}: {formatNumber(point.downloads)} downloads
                                    </title>
                                </circle>
                            );
                        })}

                        {/* Y-axis */}
                        <line
                            x1={padding.left}
                            y1={padding.top}
                            x2={padding.left}
                            y2={padding.top + chartHeight}
                            stroke='currentColor'
                            strokeOpacity={0.3}
                        />

                        {/* X-axis */}
                        <line
                            x1={padding.left}
                            y1={padding.top + chartHeight}
                            x2={padding.left + chartWidth}
                            y2={padding.top + chartHeight}
                            stroke='currentColor'
                            strokeOpacity={0.3}
                        />

                        {/* Y-axis labels */}
                        {yTickValues.map((value, i) => {
                            const y =
                                padding.top + chartHeight - ((value - minDownloads) / downloadRange) * chartHeight;
                            return (
                                <text
                                    key={`y-label-${i}`}
                                    x={padding.left - 10}
                                    y={y + 4}
                                    textAnchor='end'
                                    fontSize={12}
                                    fill='currentColor'
                                    fillOpacity={0.7}
                                >
                                    {formatNumber(value)}
                                </text>
                            );
                        })}

                        {/* X-axis labels */}
                        {xTickIndices.map((index) => {
                            const point = sortedData[index];
                            const x = padding.left + (index / (sortedData.length - 1)) * chartWidth;
                            const date = new Date(point.day);
                            const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                            return (
                                <text
                                    key={`x-label-${index}`}
                                    x={x}
                                    y={padding.top + chartHeight + 20}
                                    textAnchor='middle'
                                    fontSize={12}
                                    fill='currentColor'
                                    fillOpacity={0.7}
                                >
                                    {label}
                                </text>
                            );
                        })}

                        {/* Chart title */}
                        <text
                            x={padding.left + chartWidth / 2}
                            y={padding.top - 5}
                            textAnchor='middle'
                            fontSize={14}
                            fill='currentColor'
                            fillOpacity={0.8}
                            fontWeight={500}
                        >
                            Daily Downloads for {packageName}
                        </text>
                    </svg>
                </div>

                {/* Summary stats */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t'>
                    <div className='text-center'>
                        <p className='text-sm text-muted-foreground'>Peak</p>
                        <p className='text-lg font-semibold text-green-600'>{formatNumber(maxDownloads)}</p>
                    </div>
                    <div className='text-center'>
                        <p className='text-sm text-muted-foreground'>Average</p>
                        <p className='text-lg font-semibold'>
                            {formatNumber(
                                Math.round(sortedData.reduce((sum, d) => sum + d.downloads, 0) / sortedData.length),
                            )}
                        </p>
                    </div>
                    <div className='text-center'>
                        <p className='text-sm text-muted-foreground'>Total</p>
                        <p className='text-lg font-semibold text-blue-600'>
                            {formatNumber(sortedData.reduce((sum, d) => sum + d.downloads, 0))}
                        </p>
                    </div>
                    <div className='text-center'>
                        <p className='text-sm text-muted-foreground'>Days Tracked</p>
                        <p className='text-lg font-semibold'>{sortedData.length}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
