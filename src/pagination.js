import { updatePageUI } from './update.js';
import { fetchData } from './api.js';

const prev = $('#news-prev');
const next = $('#news-next');
const current = $('#news-current-page');

/**
 * Updates the pagination with page number and url
 * @param {Object} data The response object
 * @param {String} url The URL that was fetched
 */
export function updatePagination(data, url) {
    
    // Set current page
    current.text(data.page);

    // Use RegEx to remove the page_number query param,
    // otehrwise it will interfear with url and have it twice
    const baseUrl = url.replace(/(&page_number=[0-9])$/gi, '');

    // Attach the pagination data to the buttons, for previons and next

    // Prev Button
    const prevPage = data.page - 1;
    if (prevPage > 0) {
        prev.attr('data-url', baseUrl);
        prev.attr('data-page', prevPage);
        prev.removeAttr('disabled');
    } else {
        prev.attr('disabled', true);
    }

    // Next Button
    const nextPage = data.page + 1;
    next.attr('data-page', nextPage);
    next.attr('data-url', baseUrl);
}

/**
 * Fetches new data, next or previous page
 * @param {Object} event
 */
async function paginatePage(event) {
    const { page, url } = event.target.dataset;
    const newUrl = `${ url }&page_number=${page}`;
    const data = await fetchData(newUrl);
    updatePageUI(data, newUrl)
}

next.on('click', paginatePage);
prev.on('click', paginatePage);