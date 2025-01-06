 export function timeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    const intervals = {
        year: 365 * 24 * 60 * 60,
        month: 30 * 24 * 60 * 60,
        week: 7 * 24 * 60 * 60,
        day: 24 * 60 * 60,
        hour: 60 * 60,
        minute: 60,
        second: 1,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(diffInSeconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }

    return "just now";
}
