import { useWebsiteSuggestions } from '@/context/WebsiteSuggestionsContext';
import { LoadMoreButton } from '@/components/LoadMoreButton';
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from '@/components/animate-ui/radix/tabs';
import { WebsiteComparisonTable } from '@/components/website-suggestions/WebsiteComparisonTable';
import { WebsiteSuggestionsExamples } from '@/components/website-suggestions/WebsiteSuggestionsExamples';
import { Toaster } from '@/components/ui/sonner';
import { WebsiteSuggestionInput } from '@/components/website-suggestions/WebsiteSuggestionInput';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAction, useMutation } from 'convex/react';
import { api } from '@convex/api';
import { ChatMessages } from '@/components/website-suggestions/ChatMessages';

export const WebsiteSuggestionsChat = () => {
    const {
        currentPrompt,
        setCurrentPrompt,
        clearSuggestions,
        suggestedUrls,
        currentThreadId,
        setCurrentThreadId,
        isStreaming,
        threadSuggestions,
        isLoadingThreadMessages,
    } = useWebsiteSuggestions();

    const createNewThreadMutation = useMutation(api.threads.createNewThread);
    const loadMoreSuggestionsMutation = useAction(api.websiteSuggestions.loadMoreSuggestions);

    const handleSubmit = async (amount: number) => {
        if (!currentPrompt) return;
        setCurrentPrompt('');

        clearSuggestions();

        try {
            // Create new thread with the prompt as initial message
            const threadId = await createNewThreadMutation({
                initialMessage: currentPrompt,
                title: `${currentPrompt.slice(0, 50)}...`,
            });

            setCurrentThreadId(threadId);
        } catch (error) {
            console.error('Error creating thread:', error);
        }
    };

    const handleLoadMore = async (amount: number) => {
        if (!currentPrompt || !currentThreadId) return;

        try {
            await loadMoreSuggestionsMutation({
                threadId: currentThreadId,
                prompt: currentPrompt,
                amount,
                existingUrls: suggestedUrls,
            });
        } catch (error) {
            console.error('Error loading more suggestions:', error);
        }
    };

    const showTabs = currentThreadId && (isStreaming || threadSuggestions.length > 0);
    const isMobile = useIsMobile();

    return (
        <div className='flex flex-col h-full min-h-0 px-0 w-full @xl/main:px-6 @4xl/main:px-[5cqw] @5xl/main:px-[20cqw] @6xl/main:px-[25cqw] lg:py-10 overflow-hidden'>
            <Toaster />
            <div
                className={cn(
                    'flex-1 flex flex-col gap-4 lg:gap-6 justify-center overflow-hidden',
                    (currentThreadId || threadSuggestions.length > 0) && 'justify-between',
                    isMobile && 'justify-end',
                )}
            >
                {showTabs ? (
                    <Tabs className='w-full overflow-hidden' defaultValue={'list'}>
                        <TabsList className='w-full'>
                            <TabsTrigger value='list'>List</TabsTrigger>
                            <TabsTrigger value='table'>Table</TabsTrigger>
                        </TabsList>
                        <TabsContents
                            className='overflow-hidden flex flex-col justify-center gap-4 lg:gap-6'
                            transition={{ duration: 0 }}
                        >
                            <TabsContent className='flex-1 min-h-0 overflow-auto' value={'list'}>
                                <ChatMessages />
                            </TabsContent>
                            <TabsContent className='flex-1 min-h-0 overflow-auto' value={'table'}>
                                <WebsiteComparisonTable />
                            </TabsContent>
                            {threadSuggestions.length > 0 && !isStreaming && (
                                <LoadMoreButton className='self-center' handleLoadMore={handleLoadMore} />
                            )}
                        </TabsContents>
                    </Tabs>
                ) : null}

                {isMobile ? (
                    <div className={cn('flex flex-col gap-4', !showTabs && 'overflow-hidden')}>
                        {!showTabs && <h1 className='text-2xl font-semibold'>Discover Websites</h1>}
                        <div className='flex-1 min-h-0 overflow-auto'>
                            {!showTabs && (
                                <div className='overflow-y-auto'>
                                    <WebsiteSuggestionsExamples onExamplePress={setCurrentPrompt} />
                                </div>
                            )}
                        </div>

                        <motion.div
                            layout
                            transition={{ type: 'spring', stiffness: 500, damping: 30, duration: 1 }}
                            className='flex-none border-t pt-2 pb-safe'
                        >
                            <WebsiteSuggestionInput
                                value={currentPrompt}
                                setValue={setCurrentPrompt}
                                onSubmit={handleSubmit}
                                clearSuggestions={clearSuggestions}
                                placeholder='e.g. Best tools for productivity'
                                className='w-full'
                            />
                        </motion.div>
                    </div>
                ) : (
                    <div className='flex flex-col gap-4'>
                        {!showTabs && <h1 className='text-2xl font-semibold'>Discover Websites</h1>}

                        <motion.div
                            layout
                            transition={{ type: 'spring', stiffness: 500, damping: 30, duration: 1 }}
                            className='flex gap-2 lg:gap-4 items-stretch'
                        >
                            <WebsiteSuggestionInput
                                value={currentPrompt}
                                setValue={setCurrentPrompt}
                                onSubmit={handleSubmit}
                                clearSuggestions={clearSuggestions}
                                placeholder='e.g. Best tools for productivity'
                                className='w-full'
                            />
                        </motion.div>
                        {!showTabs && (
                            <div className='overflow-auto'>
                                <WebsiteSuggestionsExamples onExamplePress={setCurrentPrompt} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
