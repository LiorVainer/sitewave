import { Doc } from '@convex/dataModel';
import { PartialWebsiteSuggestion, WebsiteSuggestionWithMandatoryFields } from '@/models/website-suggestion.model';

type MergeWebsiteAndWebsiteSuggestionParams = {
    website: Doc<'websites'>;
    suggestion: WebsiteSuggestionWithMandatoryFields;
};

export const mergeWebsiteAndWebsiteSuggestion = ({
    website,
    suggestion,
}: MergeWebsiteAndWebsiteSuggestionParams): PartialWebsiteSuggestion => {
    const { name, ...restWebsite } = website;

    return {
        ...suggestion,
        title: name,
        ...restWebsite,
    };
};
