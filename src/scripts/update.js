import { createNewsCard } from './newsCard.js';
import { updatePagination } from './pagination.js';

const newsResults = document.getElementById('news-results');
const store = {};

/**
 * Updates the page when new data has been received
 * @param {Object} data The response data
 * @param {String} url The URL that was fetched
 */
export function updatePageUI (data, url) {
    store.data = data;
    store.url = url;
    newsResults.style.opacity = 0;
    newsResults.addEventListener('transitionend', onTransitionEnd);
}

/**
 * Callback the fade out animation
 * @param {Object} data The response data
 * @param {String} url The URL that was fetched
 */
function appendData () {
    // Empty the parent 
    newsResults.innerHTML = '';

    // Build the HTML for the news cards
    store.data.news
        .map((n) => createNewsCard(n))
        .forEach(card => newsResults.appendChild(card));

    //Pass the search info to the pagination buttons
    updatePagination(store.data, store.url);

    newsResults.removeAttribute('style');
}

function onTransitionEnd (event) {
    if(event.propertyName === 'opacity') {
        newsResults.removeEventListener('transitionend', onTransitionEnd);
        window.scrollTo(0, 0);
        appendData();
    }
};