import { WebsiteSuggestionCard } from '@/components/website-suggestions/WebsiteSuggestionCard';
import { useWebsiteSuggestions } from '@/context/WebsiteSuggestionsContext';

export interface WebsiteSuggestionsProps {}

export const WebsiteSuggestionsCards = ({}: WebsiteSuggestionsProps) => {
    const { threadSuggestions } = useWebsiteSuggestions();

    return (
        <div className='flex flex-col gap-6 overflow-auto'>
            <div className='grid gap-6'>
                {threadSuggestions?.map((website, index) => (
                    <WebsiteSuggestionCard key={index} websiteSuggestion={website} />
                ))}
            </div>
        </div>
    );
};
