import { initFilters } from './filters.js';
import { initCategoryChange } from './category.js';
import { initLanguageChange } from './language.js';
import { initRegionChange } from './region.js';
import { initDateChange } from './date.js';
import { initSearch } from './search.js';
import { initTheme } from './theme.js';

/**
 * Initializes modules
 */
async function startApp () {

    // Initialize
    initFilters();
    initCategoryChange();
    initLanguageChange();
    initRegionChange();
    initDateChange();
    initSearch();
    initTheme();
}

startApp();