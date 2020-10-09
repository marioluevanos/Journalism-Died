import { updatePageUI } from './update.js';
import { buildUrl, fetchData } from './api.js';
import { closeAllFilters, updateTrayText } from './filters.js';

const regions = document.getElementById('select-region');

/**
 * Initialize the change events for the region filters
 */
export function initRegionChange() {

    regions.addEventListener('change', onChange);

    // Update the page when the region has changed
    async function onChange (event) {
        const region = event.target.value;
        const url = buildUrl({ regionsVal: region });
        const data = await fetchData(url);

        // Update the page results
        updatePageUI(data, url);
        updateTrayText({ region: event.target });
        closeAllFilters();
    }
}
