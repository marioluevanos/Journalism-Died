import { updatePageUI } from './update.js';
import { fetchData } from './api.js';
import {
    closeAllFilters,
    updateTrayText,
    loadStoredFilter
} from './filters.js';

const regionsEl = document.getElementById('select-region');

/**
 * Initialize the change events for the region filters
 */
export function initRegionChange() {
    regionsEl.addEventListener('change', onChange);
    loadStoredFilter('region', regionsEl);
}

// Update the page when the region has changed
async function onChange (event) {
    const { data, url } = await fetchData();

    // Update the page results
    updatePageUI(data, url);
    updateTrayText({ region: event.target });
    closeAllFilters();

    // Save to local storage
    localStorage.setItem('region', event.target.value);
}