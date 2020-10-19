const themeCheckbox = document.getElementById('select-theme');
const themeClassName = 'is-dark-mode';

/**
 * Initialize the change events for the theme
 */
export function initTheme() {
    themeCheckbox.addEventListener('change', onChange);
    loadTheme();
}

/**
 * Event to handle theme change
 */
function onChange (event) {
    const { checked } = event.target;
    toggleTheme(checked);
    localStorage.setItem(themeClassName, checked);
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
    const isDark = JSON.parse(localStorage.getItem(themeClassName));
    toggleTheme(isDark);
    themeCheckbox.checked = isDark;
}