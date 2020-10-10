const themeCheckbox = document.getElementById('select-theme');
const keyName = 'theme';
const themeClassName = 'is-dark-mode';

/**
 * Initialize the change events for the region filters
 */
export function initTheme() {
    themeCheckbox.addEventListener('change', onChange);
    loadTheme();
}

/**
 * Update the page when the region has changed
 */
function onChange (event) {
    const { checked } = event.target;
    toggleTheme(checked);
    localStorage.setItem(keyName, checked);
}

/**
 * Toggle the theme, adds a class to the HTML root element
 * @param {Boolean} bool
 */
function toggleTheme(bool) {
    document.documentElement.classList.toggle(themeClassName, bool);
}

/**
 * Runs once the page has loaded, sets the theme, to dark or light
 */
function loadTheme() {
    const isDark = JSON.parse(localStorage.getItem(keyName));
    toggleTheme(isDark);
    themeCheckbox.checked = isDark;
}