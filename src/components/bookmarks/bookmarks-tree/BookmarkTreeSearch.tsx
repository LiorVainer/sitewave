'use client';
import { CircleXIcon, FilterIcon } from 'lucide-react';
import { useRef } from 'react';
import { SidebarInput } from '@/components/animate-ui/radix/sidebar';

export function BookmarkTreeSearch({
    value,
    onChange,
    onClear,
    treeSearchProps,
}: {
    value: string;
    onChange: (v: string) => void;
    onClear: () => void;
    treeSearchProps: any;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className='relative'>
            <SidebarInput
                ref={inputRef}
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    treeSearchProps.onChange?.(e);
                }}
                onBlur={(e) => {
                    e.preventDefault();
                    treeSearchProps.onChange?.({ target: { value } } as any);
                }}
                type='search'
                placeholder='Search'
                className='peer ps-9 text-sm'
            />
            <div className='absolute inset-y-0 start-0 flex items-center ps-3 text-muted-foreground/80 pointer-events-none'>
                <FilterIcon size={14} />
            </div>
            {value && (
                <button
                    onClick={() => {
                        onClear();
                        treeSearchProps.onChange?.({ target: { value: '' } } as any);
                    }}
                    className='absolute inset-y-0 end-0 flex w-9 items-center justify-center text-muted-foreground/80 hover:text-foreground'
                >
                    <CircleXIcon className='size-4' />
                </button>
            )}
        </div>
    );
}
