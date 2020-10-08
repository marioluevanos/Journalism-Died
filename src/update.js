import { createNewsCard } from './newsCard.js';
import { updatePagination } from './pagination.js';

const newsResults = $("#news-results");
const duration = 300;

/**
 * Updates the page when new data has been received
 * @param {Object} data The response data
 * @param {String} url The URL that was fetched
 */
export function updatePageUI (data, url) {    
    newsResults.animate({ opacity: 0 }, duration, onAnimationComplete.bind(null, { data, url }));
}

/**
 * Callback the fade out animation
 * @param {Object} data The response data
 * @param {String} url The URL that was fetched
 */
function onAnimationComplete ({ data, url }) {
    
    // Empty the parent 
    newsResults.html('');

    // Build the HTML for the news cards
    const newsCards = data.news.map((n) => createNewsCard(n))
    newsResults.append(newsCards);

    //Pass the search info to the pagination buttons
    updatePagination(data, url);

    const onScrollComplete = () => newsResults.animate({ opacity: 1 }, duration);

    // Scroll to the top and fade back in
    $('html, body').animate({ scrollTop: 0 }, duration, onScrollComplete);
}