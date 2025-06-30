'use client';

import { cn } from '@/lib/utils';
import { FC, useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Send } from 'lucide-react';
import SliderNumberFlow from '@/components/ui/slider-number-flow';

import { useSliderWithInput } from '@/hooks/use-slider-with-input';
import { Slider } from '@/components/ui/slider';

interface WebsiteSuggestionInputProps {
    onSubmit?: (prompt: string, amount: number[]) => void;
    placeholder?: string;
    className?: string;
}

type InputState = 'idle' | 'focused' | 'loading' | 'submitted';

const MIN_SUGGESTIONS = 0;
const MAX_SUGGESTIONS = 20;
const DEFAULT_SUGGESTIONS = 5;

export const WebsiteSuggestionInput: FC<WebsiteSuggestionInputProps> = ({
    onSubmit,
    placeholder = 'Best tools for productivity...',
    className,
}) => {
    const [prompt, setPrompt] = useState('');
    const [amount, setAmount] = useState([DEFAULT_SUGGESTIONS]);
    const [state, setState] = useState<InputState>('idle');
    const { sliderValue, inputValues, validateAndUpdateValue, handleInputChange, handleSliderChange } =
        useSliderWithInput({ minValue: MIN_SUGGESTIONS, maxValue: MAX_SUGGESTIONS, initialValue: amount });
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setAmount(sliderValue);
    }, [sliderValue]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || state === 'loading') return;

        setState('loading');
        try {
            await onSubmit?.(prompt.trim(), amount);
            setState('submitted');
            // Reset to idle after a brief moment
            setTimeout(() => setState('idle'), 1000);
        } catch (error) {
            console.error('Error submitting prompt:', error);
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
    const canSubmit = prompt.trim().length > 0 && !isDisabled;

    return (
        <div className={cn('w-full mx-auto', className)}>
            <form onSubmit={handleSubmit} className='relative'>
                {/* Desktop layout */}
                <div className='w-full hidden md:flex items-center gap-3 p-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 shadow-lg'>
                    <div className='flex-1 relative'>
                        <Input
                            ref={inputRef}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholder={placeholder}
                            disabled={isDisabled}
                            className={cn(
                                'border-0 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300',
                                state === 'focused' && 'shadow-md ring-2 ring-blue-500/20 bg-white',
                                state === 'loading' && 'bg-gray-50',
                            )}
                        />
                    </div>
                    <div className='flex items-center gap-4 w-60'>
                        <Slider
                            className='grow'
                            value={sliderValue}
                            onValueChange={handleSliderChange}
                            min={MIN_SUGGESTIONS}
                            max={MAX_SUGGESTIONS}
                            aria-label='Slider with input'
                        />
                        <Input
                            className='h-8 w-12 px-2 py-1'
                            type='text'
                            inputMode='decimal'
                            value={inputValues[0]}
                            onChange={(e) => handleInputChange(e, 0)}
                            onBlur={() => validateAndUpdateValue(inputValues[0], 0)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    validateAndUpdateValue(inputValues[0], 0);
                                }
                            }}
                            aria-label='Enter value'
                        />
                    </div>
                    <motion.div
                        whileHover={canSubmit ? { scale: 1.05 } : {}}
                        whileTap={canSubmit ? { scale: 0.95 } : {}}
                    >
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
                    </motion.div>
                </div>

                {/* Mobile layout */}
                <div className='md:hidden space-y-3'>
                    <div className='relative'>
                        <Input
                            ref={inputRef}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholder={placeholder}
                            disabled={isDisabled}
                            className={cn(
                                'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 transition-all duration-300',
                                state === 'focused' && 'shadow-lg ring-2 ring-blue-500/20 from-white to-white',
                                state === 'loading' && 'bg-gray-50',
                            )}
                        />
                    </div>
                    <SliderNumberFlow
                        className='w-full mt-12'
                        value={amount}
                        onValueChange={setAmount}
                        min={0}
                        max={20}
                        step={1}
                        aria-label='Volume'
                    />
                    <motion.div
                        whileHover={canSubmit ? { scale: 1.02 } : {}}
                        whileTap={canSubmit ? { scale: 0.98 } : {}}
                    >
                        <Button
                            type='submit'
                            size='lg'
                            variant={'gradient'}
                            disabled={!canSubmit}
                            className={cn(
                                'w-full relative overflow-hidden transition-all duration-300',
                                !canSubmit && 'opacity-50 cursor-not-allowed hover:scale-100',
                            )}
                        >
                            <AnimatePresence mode='wait'>
                                {state === 'loading' ? (
                                    <motion.div
                                        key='loading'
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3 }}
                                        className='flex items-center gap-2'
                                    >
                                        <Loader2 className='h-4 w-4 animate-spin' />
                                        <span>Generating...</span>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key='send'
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className='flex items-center gap-2'
                                    >
                                        <Send className='h-4 w-4' />
                                        <span>Get Suggestions</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </motion.div>
                </div>
            </form>
        </div>
    );
};
