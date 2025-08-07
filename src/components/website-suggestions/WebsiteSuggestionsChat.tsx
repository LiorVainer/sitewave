import { suggestWebsites } from '@/app/actions';
import { WebsiteSuggestionsCards } from '@/components/website-suggestions/WebsiteSuggestionsCards';
import { useWebsiteSuggestions } from '../../context/WebsiteSuggestionsContext';
import { LoadMoreButton } from '@/components/LoadMoreButton';
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from '@/components/animate-ui/radix/tabs';
import { WebsiteComparisonTable } from '@/components/website-suggestions/WebsiteComparisonTable';
import { StreamingWebsiteSuggestionsCards } from '@/components/website-suggestions/StreamingWebsiteSuggestionsCards';
import { WebsiteSuggestionsExamples } from '@/components/website-suggestions/WebsiteSuggestionsExamples';
import { Toaster } from '@/components/ui/sonner';
import { WebsiteSuggestionInput } from '@/components/website-suggestions/WebsiteSuggestionInput';
import { useIsMobile } from '@/hooks/use-mobile';

export const WebsiteSuggestionsChat = () => {
    const {
        currentPrompt,
        setCurrentPrompt,
        setWebsiteSuggestionsStream,
        websiteSuggestionsStream,
        clearSuggestions,
        localSuggestions,
        suggestedUrls,
    } = useWebsiteSuggestions();

    const handleSubmit = async (amount: number) => {
        if (!currentPrompt) return;

        clearSuggestions();
        const stream = await suggestWebsites(currentPrompt, amount);
        setWebsiteSuggestionsStream(stream);
    };

    const handleLoadMore = async (amount: number) => {
        if (!currentPrompt) return;

        const stream = await suggestWebsites(currentPrompt, amount, suggestedUrls);
        setWebsiteSuggestionsStream(stream);
    };

    const showTabs = websiteSuggestionsStream || localSuggestions.length > 0;
    const isMobile = useIsMobile();
    return (
        <div className='flex flex-col px-0 w-full @xl/main:px-6 @4xl/main:px-[5cqw] @5xl/main:px-[10cqw] @6xl/main:px-[15cqw] lg:py-10 overflow-hidden min-h-0 h-full gap-4'>
            <Toaster />
            <h1 className='text-2xl font-semibold'>Discover Websites</h1>

            <div className='flex-1 flex flex-col gap-4 justify-between overflow-hidden'>
                {showTabs ? (
                    <Tabs className='w-full overflow-hidden' defaultValue={'list'}>
                        <TabsList className='w-full'>
                            <TabsTrigger value='list'>List</TabsTrigger>
                            <TabsTrigger value='table'>Table</TabsTrigger>
                        </TabsList>
                        <TabsContents
                            className='overflow-hidden flex flex-col justify-center gap-4'
                            transition={{ duration: 0 }}
                        >
                            <TabsContent className='flex-1 min-h-0 overflow-auto' value={'list'}>
                                {websiteSuggestionsStream ? (
                                    <StreamingWebsiteSuggestionsCards
                                        onStreamEnd={() => setWebsiteSuggestionsStream(null)}
                                    />
                                ) : (
                                    <WebsiteSuggestionsCards />
                                )}
                            </TabsContent>
                            <TabsContent value={'table'}>{<WebsiteComparisonTable />}</TabsContent>
                            {localSuggestions.length > 0 && (
                                <LoadMoreButton className='self-center' handleLoadMore={handleLoadMore} />
                            )}
                        </TabsContents>
                    </Tabs>
                ) : null}

                {isMobile ? (
                    <div className='flex flex-col'>
                        <div className='flex-1 min-h-0 overflow-auto'>
                            {!showTabs && (
                                <div className='overflow-y-auto'>
                                    <WebsiteSuggestionsExamples onExamplePress={setCurrentPrompt} />
                                </div>
                            )}
                        </div>

                        <div className='flex-none border-t pt-2 pb-safe'>
                            <WebsiteSuggestionInput
                                value={currentPrompt}
                                setValue={setCurrentPrompt}
                                onSubmit={handleSubmit}
                                clearSuggestions={clearSuggestions}
                                placeholder='e.g. Best tools for productivity'
                                className='w-full'
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className='flex gap-2 items-stretch'>
                            <WebsiteSuggestionInput
                                value={currentPrompt}
                                setValue={setCurrentPrompt}
                                onSubmit={handleSubmit}
                                clearSuggestions={clearSuggestions}
                                placeholder='e.g. Best tools for productivity'
                                className='w-full '
                            />
                        </div>
                        {!showTabs && (
                            <div className='overflow-y-auto'>
                                <WebsiteSuggestionsExamples onExamplePress={setCurrentPrompt} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
