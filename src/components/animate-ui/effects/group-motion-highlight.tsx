import { MotionHighlight } from '@/components/animate-ui/effects/motion-highlight';

export const GroupMotionHighlight = ({ children }: { children: React.ReactNode }) => (
    <MotionHighlight hover transition={{ type: 'spring', stiffness: 350, damping: 35 }} controlledItems mode='parent'>
        {children}
    </MotionHighlight>
);
