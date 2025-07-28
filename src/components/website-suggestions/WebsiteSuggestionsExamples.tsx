import { PROMPTS_EXAMPLES } from '@/constants/prompts.const';
import { Button } from '@/components/ui/button';

export type WebsiteSuggestionsExamplesProps = {
    onExamplePress: (prompt: string) => void;
};

export const WebsiteSuggestionsExamples = ({ onExamplePress }: WebsiteSuggestionsExamplesProps) => (
    <div className='grid grid-cols-2 gap-4'>
        {Object.entries(PROMPTS_EXAMPLES).map(([subject, prompt]) => (
            <Button
                onClick={() => {
                    onExamplePress(prompt);
                }}
                variant='ghost'
                className='h-[100px] bg-white flex flex-col border-1 flex-wrap items-start'
                key={subject}
            >
                <h2 className='text-sm font-semibold text-gray-800'>{subject}</h2>
                <p className='text-xs text-muted-foreground break-words whitespace-normal leading-snug line-clamp-4 text-left'>
                    {prompt}
                </p>
            </Button>
        ))}
    </div>
);
