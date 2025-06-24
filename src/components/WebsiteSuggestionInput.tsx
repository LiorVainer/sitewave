import { cn } from '@/lib/utils';
import { FC, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Send } from 'lucide-react';

interface WebsiteSuggestionInputProps {
  onSubmit?: (prompt: string) => void;
  placeholder?: string;
  className?: string;
}

type InputState = 'idle' | 'focused' | 'loading' | 'submitted';

// Main component
export const WebsiteSuggestionInput: FC<WebsiteSuggestionInputProps> = ({
  onSubmit = async (prompt: string) => {
    // Default mock API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('Submitted prompt:', prompt);
  },
  placeholder = 'Best tools for productivity...',
  className,
}) => {
  const [prompt, setPrompt] = useState('');
  const [state, setState] = useState<InputState>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || state === 'loading') return;

    setState('loading');
    try {
      await onSubmit(prompt.trim());
      setState('submitted');
      setPrompt('');
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
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      <form onSubmit={handleSubmit} className='relative'>
        {/* Desktop layout */}
        <div className='hidden md:flex items-center gap-3 p-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 shadow-lg'>
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

          <motion.div whileHover={canSubmit ? { scale: 1.05 } : {}} whileTap={canSubmit ? { scale: 0.95 } : {}}>
            <Button
              type='submit'
              variant='gradient'
              size='icon'
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

          <motion.div whileHover={canSubmit ? { scale: 1.02 } : {}} whileTap={canSubmit ? { scale: 0.98 } : {}}>
            <Button
              type='submit'
              variant='gradient'
              size='lg'
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
