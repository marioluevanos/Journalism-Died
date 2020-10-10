const BASE_URL = 'https://api.currentsapi.services/v1';
const KEY = '7yVfJqcqsh1Mba0eBKq9X26k4D6eEnWLwt9bAgSkFyzB5xhH';
const htmlEl = document.documentElement;
const newsResults = document.getElementById('news-results');
const keywordsEl = document.getElementById('keywords');
const languageEl = document.getElementById('select-language');
const regionEl = document.getElementById('select-region');
const categoriesEl = document.getElementById('select-categories');
const startDateEl = document.getElementById('select-date-start');
const endDateEl = document.getElementById('select-date-end');
const isDev = window.location.hostname === '127.0.0.1';

/**
 * @param {Boolean} latestNews If true, fetch the latest news.
 * @param {String} fetchUrl Explicit fetch url to search, instead of building url
 * @return {Object} The data and the url searched
 */
export async function fetchData ({ latestNews, fetchUrl } = {}) {
    
    // Check if a fetchUrl has been passed, if not, build the url from the input values
    const url = !fetchUrl ? buildUrl({ latestNews }) : fetchUrl;
    let newsData;

    // Add loading class
    htmlEl.classList.add('is-loading');

    if(isDev) {
        if(localStorage.getItem(url)) {
            newsData = JSON.parse(localStorage.getItem(url));
            
            // Remove the loading screen
            htmlEl.classList.remove('is-loading');
            return {
                data: newsData,
                url
            };
        }
    }

    try {
        const response = await fetch(url);
        if(response.ok) {
            const data = await response.json();
            newsData = data;
            if (isDev) localStorage.setItem(url, JSON.stringify(data));
        } else {
            newsResults.innerHTML = '<h2 style="text-align: center">Something went wrong with the server.</h2>';
        }
    } catch(error) {
        console.error(error);
    }
    // Remove the loading class
    htmlEl.classList.remove('is-loading');
    
    return {
        data: newsData,
        url
    };
}

/**
 * A generalized fetch function to get DropDown menu data
 * @param {String} name The name of the drop down to fetch
 * @returns {Array | Object} The dropdown values
 */
export async function fetchDropDown (name = '') {
    if(localStorage.getItem(name)) {
        return JSON.parse(localStorage.getItem(name));
    }
    // from Currents API Endpoint docs
    const url = `${ BASE_URL }/available/${ name }?apiKey=${ KEY }`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const dropDownType = data[name];
        localStorage.setItem(name, JSON.stringify(dropDownType));
        return dropDownType;
    } catch(error) {
        console.error(error);
    }
}

export function buildUrl ({ latestNews } = {}) {

    // Check if the inputs have any user value
    const isKeyword = keywordsEl.value !== '';
    const isLanguage = languageEl.value !== 'any';
    const isRegion = regionEl.value !== 'any';
    const isCategory = categoriesEl.value !== 'any';
    const isStartDate = startDateEl.value !== '';
    const isEndDate = endDateEl.value !== '';
    const isAllBlank = !isKeyword && !isLanguage && !isRegion && !isCategory && !isStartDate && !isEndDate;

    // Contruct the base url
    let searchUrl = `${ BASE_URL }/search?&apiKey=${ KEY }`;

    if(isKeyword) {
        searchUrl += `&keywords=${ keywordsEl.value }`;
    }
    if(isLanguage) {
        searchUrl += `&language=${ languageEl.value }`;
    }
    if(isRegion) {
        searchUrl += `&country=${ regionEl.value }`;
    }
    if(isCategory) {
        searchUrl += `&category=${ categoriesEl.value }`;
    }
    if(isStartDate) {
        searchUrl += `&start_date=${ startDateEl.value }`;
    }
    if(isEndDate) {
        searchUrl += `&end_date=${ endDateEl.value }`;
    }
    if(isAllBlank || latestNews) {
        // If they are all blank, use default search string
        searchUrl = `${ BASE_URL }/latest-news?apiKey=${ KEY }`;
    }
    if (latestNews) {
        resetSearchValues();
    }
    return searchUrl;
}

/**
 * Resets everything except the language filter, since language is an accepted param in latest-news
 */
function resetSearchValues() {
    categoriesEl.value = 'any';
    keywordsEl.value = '';
    regionEl.value = 'any';
    startDateEl.value = '';
    endDateEl.value = '';
}