import { WebsiteSuggestionCard } from '@/components/website-suggestions/WebsiteSuggestionCard';
import { useWebsiteSuggestions } from '@/context/WebsiteSuggestionsContext';

export interface WebsiteSuggestionsProps {}

export const WebsiteSuggestionsCards = ({}: WebsiteSuggestionsProps) => {
    const { localSuggestions } = useWebsiteSuggestions();

    return (
        <div className='flex flex-col gap-6'>
            <div className='grid gap-6'>
                {localSuggestions?.map((website, index) => (
                    <WebsiteSuggestionCard key={index} websiteSuggestion={website} />
                ))}
            </div>
        </div>
    );
};
