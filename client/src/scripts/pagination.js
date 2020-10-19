import { updatePageUI } from './update.js';
import { fetchData } from './api.js';

const prev = document.getElementById('news-prev');
const next = document.getElementById('news-next');
const current = document.getElementById('news-current-page');

/**
 * Updates the pagination with page number and url
 * @param {Object} data The response object
 * @param {String} url The URL that was fetched
 */
export function updatePagination(data, url) {

    // Set current page
    current.innerText = data.page;

    // Attach the pagination data to the buttons, for previons and next
    // Prev Button
    const prevPage = data.page - 1;
    if (prevPage > 0) {
        prev.setAttribute('data-page', prevPage);
        prev.removeAttribute('disabled');
    } else {
        prev.setAttribute('disabled', true);
    }

    // Next Button
    const nextPage = data.page + 1;
    next.setAttribute('data-page', nextPage);
}

/**
 * Fetches new data, next or previous page
 * @param {Object} event
 */
async function paginatePage(event) {
    const { page } = event.target.dataset;
    const response = await fetchData({  pageNumber: page });
    
    updatePageUI(response.data, response.url)
}

next.addEventListener('click', paginatePage);
prev.addEventListener('click', paginatePage);