import { createNewsCard } from './newsCard.js';
import { updatePagination } from './pagination.js';
import { fetchData } from './api.js';

const newsResults = document.getElementById('news-results');
let store = {};

/**
 * Updates the page when new data has been received
 * @param {Object} data The response data
 * @param {String} url The URL that was fetched
 */
export function updatePageUI (data = { news: [] }, url = '' ) {
    store = { data, url };
    newsResults.style.opacity = 0;
    newsResults.addEventListener('transitionend', onTransitionEnd);
}

/**
 * Callback the fade out animation
 * @param {Object} data The response data
 * @param {String} url The URL that was fetched
 */
function appendData () {
    
    // If there are not search results
    if (store.data.news.length === 0) {
        return searchNotFound();
    } else {
        // Empty the parent 
        newsResults.innerHTML = '';
    }

    // Build the HTML for the news cards
    store.data.news
        .map((n) => createNewsCard(n))
        .forEach(card => newsResults.appendChild(card));

    //Pass the search info to the pagination buttons
    updatePagination(store.data, store.url);

    // Remove the style attribute to show the element again (removes opacity)
    newsResults.removeAttribute('style');
}

function onTransitionEnd (event) {
    if(event.propertyName === 'opacity') {
        newsResults.removeEventListener('transitionend', onTransitionEnd);
        window.scrollTo(0, 0);
        appendData();
    }
};

function searchNotFound() {
    const goBack = document.createElement('a');
    goBack.innerText = 'Go Back';
    goBack.href = '#';
    goBack.addEventListener('click', async (e) => {
        e.preventDefault();
        const { data, url } = await fetchData({ latestNews: true });
        updatePageUI(data, url);
    });
    newsResults.innerHTML = '<h2 style="margin-bottom: 30px;">Nothing found.</h2>';
    newsResults.appendChild(goBack);
    newsResults.style.cssText = 'text-align: center; padding: 30px; opacity: 1;';
}