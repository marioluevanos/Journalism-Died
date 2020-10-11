import { updatePageUI } from './update.js';
import { fetchData } from './api.js';
import { loadStoredFilter } from './filters.js';

const categoriesEl = document.getElementById('select-categories');

/**
 * Change handler for category, also sends a new request for data and updates UI
 */
export function initCategoryChange () {
    loadStoredFilter('category', categoriesEl);
    categoriesEl.addEventListener('change', onChange);
}

async function onChange (event) {
    const { data, url } = await fetchData();
    
    // Update the page results
    updatePageUI(data, url);

    // Save to local storage
    localStorage.setItem('category', event.target.value);
}

/**
 * The category tags that lay with the news cards
 * @param {Object} event
 */
export async function onCategoryTagClick (event) {
    event.preventDefault();
    const { category } = event.target.dataset;
    const { data, url } = await fetchData();

    // Update the category selector
    categoriesEl.value = category;

    // Update the page results
    updatePageUI(data, url); 
    
    // Save to local storage
    localStorage.setItem('category', category);
}