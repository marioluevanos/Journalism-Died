import { fetchData } from './api.js';
import { updatePageUI } from './update.js';

// Cache Elements
const newsTitle = document.querySelector('h1');
const keywords = document.getElementById('keywords');
const searchForm = document.getElementById('news-form');
const searchButton = document.getElementById('search-button');

/**
 * Initialize the search and add search events
 */
export function initSearch () {
    keywords.addEventListener('focus', onSearchFocus);
    keywords.addEventListener('blur', onSearchBlur);
    searchButton.addEventListener("click", onSearchClick);
    newsTitle.addEventListener('click', onTitleClick);

    // Search on inital load
    onSearchClick();
}

/**
 * Click hanlder that creates a new search URL, fetched the data, and updates the UI
 * @param {Object} event
 */
async function onSearchClick (event) {
    if(event) event.preventDefault();
    
    const { data, url } = await fetchData();
    updatePageUI(data, url);
}

function onSearchFocus() {
    searchForm.classList.add('is-focused');
}

function onSearchBlur () {
    searchForm.classList.remove('is-focused');
}

function onTitleClick() {
    const half = window.scrollY / 2;
    const diff = window.scrollY > half ? window.innerHeight : 0;
    const percent = (window.scrollY + diff) / (document.body.clientHeight);
    const timeout = 1000 * percent;
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    setTimeout(async () => {
        const { data, url } = await fetchData({ latestNews: true });
        updatePageUI(data, url);
    }, timeout);
}