const getTimeByDate = (dateString) => {
    const now = new Date().getTime();
    const difference = now - new Date(dateString).getTime();

    // Calculate time components
    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44)); // Average days in a month
    const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25)); // Average days in a year

    // Determine the appropriate time unit
    if (years > 0) {
        return years + (years === 1 ? ' year ago' : ' years ago');
    } else if (months > 0) {
        return months + (months === 1 ? ' month ago' : ' months ago');
    } else if (days > 0) {
        return days + (days === 1 ? ' day ago' : ' days ago');
    } else if (hours > 0) {
        return hours + (hours === 1 ? ' hour ago' : ' hours ago');
    } else if (minutes > 0) {
        return minutes + (minutes === 1 ? ' minute ago' : ' minutes ago');
    } else {
        return 'now'
    }
}

export default getTimeByDate;