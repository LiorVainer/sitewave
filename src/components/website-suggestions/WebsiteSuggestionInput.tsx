'use client';

import { cn } from '@/lib/utils';
import { FC, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Send, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface WebsiteSuggestionInputProps {
    value: string;
    setValue: (value: string) => void;
    onSubmit?: (amount: number) => void;
    clearSuggestions: () => void;
    placeholder?: string;
    className?: string;
}

type InputState = 'idle' | 'focused' | 'loading' | 'submitted';

const DEFAULT_SUGGESTIONS = 5;

export const WebsiteSuggestionInput: FC<WebsiteSuggestionInputProps> = ({
    onSubmit,
    placeholder = 'Best tools for productivity...',
    className,
    value,
    setValue,
    clearSuggestions,
}) => {
    const [state, setState] = useState<InputState>('idle');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim() || state === 'loading') return;

        setState('loading');
        try {
            await onSubmit?.(DEFAULT_SUGGESTIONS);
            setState('submitted');
            // Reset to idle after a brief moment
            setTimeout(() => setState('idle'), 1000);
        } catch (error) {
            console.error('Error submitting value:', error);
            setState('idle');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleFocus = () => {
        if (state === 'idle') setState('focused');
    };

    const handleBlur = () => {
        if (state === 'focused') setState('idle');
    };

    const isDisabled = state === 'loading';
    const canSubmit = value.trim().length > 0 && !isDisabled;

    return (
        <div className={cn('w-full mx-auto', className)}>
            <form onSubmit={handleSubmit} className='relative'>
                {/* Mobile layout */}
                <div className='relative flex items-center gap-2 h-[100px] items-stretch'>
                    <Textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        disabled={isDisabled}
                        className={cn(
                            'bg-gradient-to-r resize-none from-blue-50 to-purple-50 border-blue-200/50 transition-all duration-300 flex-1',
                            state === 'loading' && 'bg-gray-50',
                        )}
                    />
                    <div className='flex gap-2 absolute right-2 bottom-2'>
                        {value && (
                            <Button
                                type='submit'
                                size='icon'
                                variant='outline'
                                onClick={() => {
                                    clearSuggestions();
                                    setValue('');
                                }}
                                className={cn('relative overflow-hidden transition-all duration-300')}
                            >
                                <X />
                            </Button>
                        )}
                        <Button
                            type='submit'
                            size='icon'
                            variant='gradient'
                            disabled={!canSubmit}
                            className={cn(
                                'relative overflow-hidden transition-all duration-300',
                                !canSubmit && 'opacity-50 cursor-not-allowed hover:scale-100',
                            )}
                        >
                            <AnimatePresence mode='wait'>
                                {state === 'loading' ? (
                                    <motion.div
                                        key='loading'
                                        initial={{ opacity: 0, rotate: -180 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: 180 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Loader2 className='h-4 w-4 animate-spin' />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key='send'
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.3 }}
                                        whileHover={canSubmit ? { x: 2 } : {}}
                                    >
                                        <Send className='h-4 w-4' />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
