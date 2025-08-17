import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export function formatCreationTime(dateMs: number) {
    const date = new Date(dateMs);

    if (isToday(date)) {
        // same calendar day → relative
        return formatDistanceToNow(date, { addSuffix: true }); // e.g. "2h ago"
    }

    if (isYesterday(date)) {
        // any time yesterday → "Yesterday"
        return 'Yesterday';
    }

    // older → absolute date
    return format(date, 'MMM d, yyyy'); // e.g. "Aug 15, 2025"
}
