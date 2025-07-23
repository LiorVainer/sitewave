import { suggestWebsites } from '@/app/actions';
import { WebsiteSuggestionInput } from '@/components/website-suggestions/WebsiteSuggestionInput';
import { WebsiteSuggestionsCards } from '@/components/website-suggestions/WebsiteSuggestionsCards';
import { useWebsiteSuggestions } from './WebsiteSuggestionsContext';
import { LoadMoreButton } from '@/components/LoadMoreButton';
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from '@/components/animate-ui/radix/tabs';
import { WebsiteComparisonTable } from '@/components/website-suggestions/WebsiteComparisonTable';
import { StreamingWebsiteSuggestionsCards } from '@/components/website-suggestions/StreamingWebsiteSuggestionsCards';

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

    return (
        <div className='space-y-6 py-6 px-6 w-full @4xl/main:px-[5cqw] @5xl/main:px-[15cqw] @7xl/main:px-[10cqw] lg:py-16'>
            <h1 className='text-2xl font-semibold'>Discover Websites</h1>

            <WebsiteSuggestionInput
                value={currentPrompt}
                setValue={setCurrentPrompt}
                onSubmit={handleSubmit}
                placeholder='e.g. Best tools for productivity'
                className='w-full'
            />
            {websiteSuggestionsStream || localSuggestions.length > 0 ? (
                <Tabs className='w-full' defaultValue={'list'}>
                    <TabsList className='w-full'>
                        <TabsTrigger value={'list'}>List</TabsTrigger>
                        <TabsTrigger value={'table'}>Table</TabsTrigger>
                    </TabsList>
                    <TabsContents transition={{ duration: 0 }}>
                        <TabsContent value={'list'}>
                            {websiteSuggestionsStream ? (
                                <StreamingWebsiteSuggestionsCards
                                    onStreamEnd={() => setWebsiteSuggestionsStream(null)}
                                />
                            ) : (
                                <WebsiteSuggestionsCards />
                            )}
                        </TabsContent>
                        <TabsContent value={'table'}>{<WebsiteComparisonTable />}</TabsContent>
                    </TabsContents>
                </Tabs>
            ) : null}
            {localSuggestions.length > 0 && <LoadMoreButton handleLoadMore={handleLoadMore} />}
        </div>
    );
};
