import { updatePageUI } from './update.js';
import { buildUrl, fetchData } from './api.js';
import { closeAllFilters } from './filters.js';

const startDate = document.getElementById('select-date-start');
const endDate = document.getElementById('select-date-end');
const apply = document.getElementById('filter-date-apply');
const keywords = document.getElementById("keywords");
const selectLanguage = document.getElementById("select-language");
const selectRegion = document.getElementById("select-region");
const selectCategories = document.getElementById("select-categories");

/**
 * Initialize date change events
 */
export function initDateChange() {

    // Add event listeners and pass in an string ID to know which date picker is being picked
    startDate.addEventListener('change', onChange.bind(null, 'startDate'));
    endDate.addEventListener('change', onChange.bind(null, 'endDate'));
    
    // This event applies a new search with a specified date range
    apply.addEventListener('click', onApply);

    // Start with undefined values
    let start;
    let end;

    // Update the start and end variables on user input
    // Function statements are hoisted to the top
    function onChange (type, event) {
        if(type === 'startDate') {
            start = event.target.value;
        }
        if(type === 'endDate') {
            end = event.target.value;
        }
    }

    // Seperate action to make sure there is a date range
    async function onApply() {

        // If start and end dates exist, create a new url
        if(start && end) {

            const url = buildUrl({
                keywordsVal: keywords.value,
                languageVal: selectLanguage.value,
                regionsVal: selectRegion.value,
                categoryVal: selectCategories.value,
                startDateVal: start,
                endDateVal: end
            });

            const data = await fetchData(url);

            // Update the page results
            updatePageUI(data, url);
            closeAllFilters();
        }
    }
}
