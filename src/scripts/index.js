import { fetchDropDown } from './api.js';
import { appendDropDownOptions } from './dropDown.js';
import { initSearch } from './search.js';
import { initCategoryChange } from './category.js';
import { initLanguageChange } from './language.js';
import { initRegionChange } from './region.js';
import { initDateChange } from './date.js';
import { initFilters } from './filters.js';
import { initTheme } from './theme.js';

/**
 * Initializes data for (categories, region, lang) which will occupy dropdowns
 */
async function startApp () {

    // Promise.all takes in an array of Promises, that run in parallel
    // It returns the results when all 3 process are completed
    const results = await Promise.all([
        fetchDropDown('categories'),
        fetchDropDown('languages'),
        fetchDropDown('regions'),
    ]);

    // Destructure the array, in the same order they were called above
    // So, first position would be the categories, etc.
    const [
        categories,
        languages,
        regions
    ] = results;

    // Woundn't normall do this, but what the heck.
    window.currentsAPI = {};
    window.currentsAPI.categories = categories;

    // Now that we have data for our DropDowns, 
    // we can use the same function to append to each dropdown <select> element
    appendDropDownOptions("#select-categories", categories);
    appendDropDownOptions("#select-language", languages);
    appendDropDownOptions("#select-region", regions);

    // Initialize the search modules and filters
    initSearch();
    initFilters();
    initCategoryChange();
    initLanguageChange();
    initRegionChange();
    initDateChange();
    initTheme();
}

startApp();