import { state } from './state.js';

const htmlEl = document.documentElement;
const newsResults = document.getElementById('news-results');
const keywordsEl = document.getElementById('keywords');
const languageEl = document.getElementById('select-language');
const regionEl = document.getElementById('select-region');
const categoriesEl = document.getElementById('select-categories');
const startDateEl = document.getElementById('select-date-start');
const endDateEl = document.getElementById('select-date-end');

/**
 * @param {Boolean} latestNews If true, fetch the latest news.
 * @return {Object} The data and the url searched
 */
export async function fetchData ({ latestNews, pageNumber } = {}) {

    let url = buildUrl({ latestNews, pageNumber });

    // Add loading class
    htmlEl.classList.add('is-loading');

    // if(state.IS_DEV) {
    //     const storedData = localStorage.getItem(url);
    //     if(storedData) {
            
    //         // Remove the loading screen
    //         htmlEl.classList.remove('is-loading');

    //         return {
    //             data: JSON.parse(storedData),
    //             url
    //         };
    //     }
    // }

    try {
        const response = await fetch(url);
        
        if(!response.ok) postErrorMessage(response);
        
        const data = await response.json();
        
        // if(state.IS_DEV) localStorage.setItem(url, JSON.stringify(data));
        
        // Remove the loading class
        htmlEl.classList.remove('is-loading');

        return { data, url };

    } catch(error) {
        console.error(error);
    }
}

/**
 * A generalized fetch function to get DropDown menu data
 * @param {String} name The name of the drop down to fetch
 * @returns {Array | Object} The dropdown values
 */
export async function fetchFilterOptions (name = '') {

    // In case third party cookies or whatever is denied by the user
    if (window.localStorage) {
        const storedData = localStorage.getItem(name);
        if(storedData) {
            return JSON.parse(storedData);
        }
    }

    const url = `${ state.BASE_URL }/filters?name=${ name }`;
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

/**
 * @param {Boolean} latestNews Explicitly get latest news
 * @param {String} pageNumber Add a page-number to the url
 * @return {String} The url to fetch
 */
export function buildUrl ({ latestNews, pageNumber } = {}) {

    // Check if the inputs have any user value
    const isKeyword = keywordsEl.value !== '';
    const isLanguage = languageEl.value !== 'any';
    const isRegion = regionEl.value !== 'any';
    const isCategory = categoriesEl.value !== 'any';
    const isStartDate = startDateEl.value !== '';
    const isEndDate = endDateEl.value !== '';
    const isAllBlank = !isKeyword && !isLanguage && !isRegion && !isCategory && !isStartDate && !isEndDate;
    const isDefault = keywordsEl.value === '' && isLanguage && !isCategory;

    // Contruct the base url
    let searchUrl = `${ state.BASE_URL }/search?`;

    if(isKeyword) {
        searchUrl += `keywords=${ keywordsEl.value }&`;
    }
    if(isLanguage) {
        searchUrl += `language=${ languageEl.value }&`;
    }
    if(isRegion) {
        searchUrl += `country=${ regionEl.value }&`;
    }
    if(isCategory) {
        searchUrl += `category=${ categoriesEl.value }&`;
    }
    if(isStartDate) {
        searchUrl += `start_date=${ startDateEl.value }&`;
    }
    if(isEndDate) {
        searchUrl += `end_date=${ endDateEl.value }&`;
    }
    if(latestNews || isDefault || isAllBlank) {
        
        // If they are all blank, use default search string
        searchUrl = `${ state.BASE_URL }/latest?`;

        if(isLanguage) {
            searchUrl += `language=${ languageEl.value }&`;
        }

        // Reset to latest news
        if (latestNews) {
            resetSearchValues();
        }
    }
    if (pageNumber) {
        searchUrl += `page_number=${ pageNumber }&`
    }

    return searchUrl.replace(/\&$/g, '');
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

function postErrorMessage(response) {
    alert(JSON.stringify(response))
    newsResults.innerHTML = '<br><h2 style="text-align: center">Something went wrong with the server.</h2>'
}