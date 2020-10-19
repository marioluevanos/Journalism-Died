// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"scripts/state.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.state = void 0;
const IS_DEV = window.location.hostname === 'localhost';
const BASE_URL = IS_DEV ? 'http://localhost:5001/journalism-died/us-central1/api' : 'https://us-central1-journalism-died.cloudfunctions.net/api';
const state = {
  IS_DEV,
  BASE_URL
};
exports.state = state;
},{}],"scripts/api.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchData = fetchData;
exports.fetchFilterOptions = fetchFilterOptions;
exports.buildUrl = buildUrl;

var _state = require("./state.js");

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

async function fetchData({
  latestNews,
  pageNumber
} = {}) {
  let url = buildUrl({
    latestNews,
    pageNumber
  }); // Add loading class

  htmlEl.classList.add('is-loading'); // if(state.IS_DEV) {
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
    if (!response.ok) postErrorMessage(response);
    const data = await response.json(); // if(state.IS_DEV) localStorage.setItem(url, JSON.stringify(data));
    // Remove the loading class

    htmlEl.classList.remove('is-loading');
    return {
      data,
      url
    };
  } catch (error) {
    console.error(error);
  }
}
/**
 * A generalized fetch function to get DropDown menu data
 * @param {String} name The name of the drop down to fetch
 * @returns {Array | Object} The dropdown values
 */


async function fetchFilterOptions(name = '') {
  // In case third party cookies or whatever is denied by the user
  if (window.localStorage) {
    const storedData = localStorage.getItem(name);

    if (storedData) {
      return JSON.parse(storedData);
    }
  }

  const url = `${_state.state.BASE_URL}/filters?name=${name}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const dropDownType = data[name];
    localStorage.setItem(name, JSON.stringify(dropDownType));
    return dropDownType;
  } catch (error) {
    console.error(error);
  }
}
/**
 * @param {Boolean} latestNews Explicitly get latest news
 * @param {String} pageNumber Add a page-number to the url
 * @return {String} The url to fetch
 */


function buildUrl({
  latestNews,
  pageNumber
} = {}) {
  // Check if the inputs have any user value
  const isKeyword = keywordsEl.value !== '';
  const isLanguage = languageEl.value !== 'any';
  const isRegion = regionEl.value !== 'any';
  const isCategory = categoriesEl.value !== 'any';
  const isStartDate = startDateEl.value !== '';
  const isEndDate = endDateEl.value !== '';
  const isAllBlank = !isKeyword && !isLanguage && !isRegion && !isCategory && !isStartDate && !isEndDate;
  const isDefault = keywordsEl.value === '' && isLanguage && !isCategory; // Contruct the base url

  let searchUrl = `${_state.state.BASE_URL}/search?`;

  if (isKeyword) {
    searchUrl += `keywords=${keywordsEl.value}&`;
  }

  if (isLanguage) {
    searchUrl += `language=${languageEl.value}&`;
  }

  if (isRegion) {
    searchUrl += `country=${regionEl.value}&`;
  }

  if (isCategory) {
    searchUrl += `category=${categoriesEl.value}&`;
  }

  if (isStartDate) {
    searchUrl += `start_date=${startDateEl.value}&`;
  }

  if (isEndDate) {
    searchUrl += `end_date=${endDateEl.value}&`;
  }

  if (latestNews || isDefault || isAllBlank) {
    // If they are all blank, use default search string
    searchUrl = `${_state.state.BASE_URL}/latest?`;

    if (isLanguage) {
      searchUrl += `language=${languageEl.value}&`;
    } // Reset to latest news


    if (latestNews) {
      resetSearchValues();
    }
  }

  if (pageNumber) {
    searchUrl += `page_number=${pageNumber}&`;
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
  alert(JSON.stringify(response));
  newsResults.innerHTML = '<br><h2 style="text-align: center">Something went wrong with the server.</h2>';
}
},{"./state.js":"scripts/state.js"}],"scripts/filters.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initFilters = initFilters;
exports.closeAllFilters = closeAllFilters;
exports.updateTrayText = updateTrayText;
exports.loadStoredFilter = loadStoredFilter;

var _api = require("./api.js");

var _state = require("./state.js");

// Cache Elements
const newsResults = document.getElementById('news-results');
const newsFilters = document.querySelector('.news-filters');
const filterButton = document.getElementById('filter-button');
const filterTrayButtons = document.querySelectorAll('.filter-tray-button');
const filterGroups = document.querySelectorAll('.filter-group');
/**
 * Initialize the search and add search events
 */

async function initFilters() {
  await loadFilters();
  filterButton.addEventListener('click', toggleAsideFilters);
  filterTrayButtons.forEach(button => button.addEventListener('click', onTrayButtonClick));
  newsResults.addEventListener('click', closeAllFilters);
}
/**
 * Toggles the aside filters, open and closes
 */


function toggleAsideFilters() {
  const closedValue = getComputedStyle(document.documentElement).getPropertyValue('--filter-width');
  const openValue = '240px'; // Toggle the class first

  newsFilters.classList.toggle('active'); // Check if the filters aside should be open or closed

  const asideWidth = newsFilters.classList.contains('active') ? openValue : closedValue; // Then assign the value to the CSS variable

  document.documentElement.style.setProperty('--ui-filters-width', asideWidth);
}
/**
 * Selects the active tray element and toggle the active class
 */


function onTrayButtonClick(event) {
  const activeName = event.target.dataset.name;
  const {
    target
  } = event;
  filterTrayButtons.forEach(button => {
    if (button.dataset.name !== activeName) {
      button.classList.remove('active');
    }
  });
  target.classList.toggle('active');

  if (target.classList.contains('active')) {
    newsResults.classList.add('is-active-filters');
  } else {
    newsResults.classList.remove('is-active-filters');
  }

  filterGroups.forEach(group => {
    const groupName = group.dataset.name;

    if (groupName !== activeName) {
      group.classList.remove('active');
    } else {
      group.classList.toggle('active');
    }
  });
}
/**
 * Removes the active classes to the filter related elements
 */


function closeAllFilters() {
  filterGroups.forEach(group => group.classList.remove('active'));
  filterTrayButtons.forEach(button => button.classList.remove('active'));
  newsResults.classList.remove('is-active-filters');
}
/**
 * Updates the tray text on a mobile device view
 * @param {HTMLSelectElement} language
 * @param {HTMLSelectElement} region
 */


function updateTrayText({
  language,
  region
}) {
  const [languageTrayText, regionTrayText] = Array.from(filterTrayButtons).map(button => button.querySelector('.tray-text'));

  if (language && languageTrayText) {
    const languageText = Array.from(language.children).find(option => option.selected).innerText;
    languageTrayText.innerText = languageText === 'Any' ? 'Language' : languageText;
  }

  if (region && regionTrayText) {
    const regionText = Array.from(region.children).find(option => option.selected).innerText;
    regionTrayText.innerText = regionText === 'Any' ? 'Region' : regionText;
  }
}
/**
 * Load once and set previous filter preference
 * @param {String} keyName
 * @param {HTMLSelectElement} el
 */


function loadStoredFilter(keyName, el) {
  const storedLang = localStorage.getItem(keyName);

  if (storedLang) {
    el.value = storedLang;
    updateTrayText({
      [keyName]: el
    });
  }
}
/**
 * Loads the category, language and regions filters from the API
 */


async function loadFilters() {
  // Promise.all takes in an array of Promises, that run in parallel
  // It returns the results when all 3 process are completed
  const results = await Promise.all([(0, _api.fetchFilterOptions)('categories'), (0, _api.fetchFilterOptions)('languages'), (0, _api.fetchFilterOptions)('regions')]); // Destructure the array, in the same order they were called above
  // So, first position would be the categories, etc.

  const [categories, languages, regions] = results;
  _state.state.categories = categories;
  _state.state.languages = languages;
  _state.state.regions = regions; // Now that we have data for our DropDowns, 
  // we can use the same function to append to each dropdown <select> element

  appendFilterOptions("#select-categories", categories);
  appendFilterOptions("#select-language", languages);
  appendFilterOptions("#select-region", regions);
}
/**
 * Loop through a list, then create and append an <option> element to it's selector
 * @param {String} selector CSS Selector
 * @param {Array | Object} list A list to interate and create an <option> element
 */


function appendFilterOptions(selector, list) {
  if (!list || !selector) return;
  const el = document.querySelector(selector); // Check if the list is an Array (without named keys)

  if (list instanceof Array) {
    sortAlphabetically(list).forEach(item => {
      el.innerHTML += `<option value=${item}>${toTitleCase(item)}</option>`;
    });
  } else {
    // If not an Array, then it's an Object with key, value pairs.
    // Create an Array from the object, 
    // with position zero[0] as key and position one[1] as value
    const entries = Object.entries(list); // Destructure the params within the arguments

    entries.forEach(([key, value]) => {
      el.innerHTML += `<option value=${value}>${toTitleCase(key)}</option>`;
    });
  }
}
/**
 * @param {String} text Some text content
 * @return {String} A text string that is title-cased ex: "Title Cased Example"
 */


function toTitleCase(text = '') {
  return text // make array of words
  .split(' ') // transform each first letter of word
  .map(word => word.replace(/\w{1}/, match => match.toUpperCase())) // join array words with space into string
  .join(' ');
}

function sortAlphabetically(list) {
  return list.sort((a, b) => b.toUpperCase() < a.toUpperCase() ? 1 : -1);
}
},{"./api.js":"scripts/api.js","./state.js":"scripts/state.js"}],"scripts/newsCard.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNewsCard = createNewsCard;

var _category = require("./category.js");

var _state = require("./state.js");

/**
 * A map function that gets applied over every iteration
 * @param {Array} data The news data to interate over and create HTML elements
 * @returns {Array} An array of HTMLElements
 */
function createNewsCard(data) {
  const news = create('div');
  const newsText = createNewsText(data);
  const hasImage = data.image !== 'None';

  if (hasImage) {
    const newsImage = createNewsImage(data);
    news.appendChild(newsImage);
    news.classList.add('has-image');
  }

  news.classList.add('news');
  news.appendChild(newsText); // For a scroll-into-view animation

  animateIntoView(news);
  return news;
}

function createNewsImage({
  url,
  image,
  title
}) {
  const newsImage = create('figure');
  const newsLink = createNewsLink({
    url
  });
  const newsPicture = create('img');
  newsImage.classList.add('news-image');
  newsPicture.setAttribute('src', image);
  newsPicture.setAttribute('alt', title);
  newsPicture.setAttribute('loading', 'lazy');
  newsPicture.setAttribute('width', '1200');
  newsPicture.setAttribute('height', '675');
  newsLink.appendChild(newsPicture);
  newsImage.appendChild(newsLink);
  return newsImage;
}

function createNewsLink({
  url,
  title = ''
}) {
  const newsLink = create('a');
  newsLink.classList.add('news-link');
  newsLink.setAttribute('href', url);
  newsLink.setAttribute('target', '_blank');
  newsLink.setAttribute('rel', 'noopener');
  newsLink.innerHTML = title;
  return newsLink;
}

function createNewsFooter({
  author,
  url
}) {
  const newsFooter = create('div');
  const newsLink = createNewsLink({
    url
  });
  const icon = createIconExternal();

  if (removeURLs(author)) {
    const newsAuthor = create('div');
    const authors = cleanUpAuthors(author);
    newsAuthor.innerHTML = `By ${authors}`;
    newsAuthor.classList.add('news-author');
    newsFooter.appendChild(newsAuthor);
  }

  newsLink.innerHTML = `Full Story ${icon}`;
  newsLink.classList.add('underline');
  newsFooter.classList.add('news-footer');
  newsFooter.appendChild(newsLink);
  return newsFooter;
}

function createNewsText({
  image,
  author,
  url,
  title,
  description,
  category,
  published
}) {
  const newsText = create('div');
  const newsMeta = createNewsMeta(category, published);
  const newsTitle = createNewsTitle({
    title,
    url
  });
  const newsDesc = create('p');
  const newsFooter = createNewsFooter({
    author,
    url
  });
  const descText = removeHTMLTags(description); // Add data & text

  newsDesc.innerHTML = removeURLs(descText); // Add classes

  newsText.classList.toggle('no-desc', !descText);
  newsText.classList.add('news-text');
  newsDesc.classList.add('news-desc');
  const hasImage = image !== 'None';

  if (!hasImage) {
    const newsHeadline = create('div');
    const newsDetails = create('div');
    newsHeadline.classList.add('news-headline');
    newsDetails.classList.add('news-details');
    newsHeadline.appendChild(newsMeta);
    newsHeadline.appendChild(newsTitle);
    newsDetails.appendChild(newsDesc);
    newsDetails.appendChild(newsFooter);
    newsText.appendChild(newsHeadline);
    newsText.appendChild(newsDetails);
  } else {
    // Append Elements
    newsText.appendChild(newsMeta);
    newsText.appendChild(newsTitle);
    newsText.appendChild(newsDesc);
    newsText.appendChild(newsFooter);
  }

  return newsText;
}

function createNewsMeta(categoriesList, published) {
  const newsMeta = create('div');
  const newsCategory = create('div');
  const separator = create('span');
  const newsPubDate = create('div');
  const date = new Date(published).toISOString();
  const pubDate = timeAgo(date);
  newsMeta.classList.add('news-meta');
  newsCategory.classList.add('news-categories');
  separator.classList.add('separator');
  newsPubDate.classList.add('news-pubdate');
  separator.innerText = '•';
  newsPubDate.innerText = pubDate; // Remove categories that are not in the dropdown

  const filteredCat = categoriesList.filter(catText => {
    if (_state.state.categories.includes(catText)) {
      return catText;
    }
  }) // Limit to display only 2 categories
  .filter((catText, idx) => idx <= 1 && catText); // Create categories elemenes for each category and attach a click event listener

  filteredCat.map(catText => {
    const category = create('a');
    category.innerText = `${catText}`;
    category.setAttribute('data-category', catText);
    category.setAttribute('href', '#');
    category.classList.add('news-category', 'underline');
    category.addEventListener('click', _category.onCategoryTagClick);
    return category;
  }) // After creating category elements, append them to the newsCategory parent element
  .forEach((category, idx) => {
    newsCategory.appendChild(category);
    const lastEl = filteredCat.length - 1 === idx;

    if (!lastEl) {
      newsCategory.innerHTML += `<span class="separator">•</span>`;
    }
  });
  newsMeta.appendChild(newsCategory);
  newsMeta.appendChild(separator);
  newsMeta.appendChild(newsPubDate);
  return newsMeta;
}

function createNewsTitle({
  title,
  url
}) {
  const newsTitle = create('h2');
  const newsLink = createNewsLink({
    title,
    url
  });
  newsLink.classList.add('underline');
  newsTitle.classList.add('news-title');
  newsTitle.appendChild(newsLink);
  return newsTitle;
}

function createIconExternal() {
  return `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
            <line x1="14.5" y1="1.5" x2="1.5" y2="14.5"></line>
            <polyline points="7.5,1.5 14.5,1.5 14.5,8.5 "></polyline>
        </svg>
    `;
}
/**
 * Authors are in different formats. This is a way to clean up the authors by removing HTML and unnecessary entities.
 * Limits authors to first three.
 * @param {String} author
 * @return {String} 
 */


function cleanUpAuthors(author) {
  // "temp" parses any html entities that need to be removed
  const temp = document.createElement('span');
  temp.innerHTML = author;
  const cleanedAuthor = removeHTMLTags(parseJSON(temp.innerText)).split(',') // Remove any false values
  .filter(Boolean) // Creates a break between author names
  .map((a, idx, src) => `${a}${src.length > 1 && idx >= 0 && idx < src.length - 1 ? ",<br>" : ""}`) // Only keep the first three authors
  .slice(0, 3).join('').trim();
  temp.remove();
  return cleanedAuthor;
}
/**
 * Removes HTML from the payload (which is not needed)
 * @param {String} html Any string containing HTML tags
 * @return {String} HTML tags removed from a string
 */


function removeHTMLTags(html = '') {
  return html.replace(/(<([^>]+)>)|(\\n)/gmi, '');
}
/**
 * Data is sometimes sending back JSON as the author
 * This check if the payload is JSON and checks and returns the name prop
 */


function parseJSON(json = '') {
  if (json.match(/(^\[{)|(}\]$)/g)) {
    const j = JSON.parse(json)[0];
    return !j ? '' : j.name;
  } else {
    return json;
  }
}
/**
 * Remove any URLs from the payload
 */


function removeURLs(text = '') {
  return text.replace(/@?https?:\/\/|(www.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/igm, '');
}
/**
 * @param {String} tag An HTML tag to create
 * @return {HTMLElement} An HTML Element
 */


function create(tag) {
  return document.createElement(tag);
}

const timeTemplates = {
  prefix: "",
  suffix: " ago",
  seconds: "less than a minute",
  minute: "a minute",
  minutes: "%d minutes",
  hour: "an hour",
  hours: "%d hours",
  day: "a day",
  days: "%d days",
  month: "about a month",
  months: "%d months",
  year: "about a year",
  years: "%d years"
};
/**
 * @param {String} t Time type
 * @param {Number} n Time elapsed
 * @return {String} Time passed in english
 */

function timeTemplate(t, n) {
  return timeTemplates[t] && timeTemplates[t].replace(/%d/i, Math.abs(Math.round(n)));
}

;
/**
 * @param {String} time ISO String time format
 * @return {String} The time pased since
 */

function timeAgo(time) {
  if (!time) return;
  time = time.replace(/\.\d+/, ""); // remove milliseconds

  time = time.replace(/-/, "/").replace(/-/, "/");
  time = time.replace(/T/, " ").replace(/Z/, " UTC");
  time = time.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400

  time = new Date(time * 1000 || time);
  const now = new Date();
  const seconds = (now.getTime() - time) * .001 >> 0;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const years = days / 365;
  return timeTemplates.prefix + (seconds < 45 && timeTemplate('seconds', seconds) || seconds < 90 && timeTemplate('minute', 1) || minutes < 45 && timeTemplate('minutes', minutes) || minutes < 90 && timeTemplate('hour', 1) || hours < 24 && timeTemplate('hours', hours) || hours < 42 && timeTemplate('day', 1) || days < 30 && timeTemplate('days', days) || days < 45 && timeTemplate('month', 1) || days < 365 && timeTemplate('months', days / 30) || years < 1.5 && timeTemplate('year', 1) || timeTemplate('years', years)) + timeTemplates.suffix;
}

;
/**
 * Intersection Obsever to create an animation when scrolled into the screen
 * @param {HTMLElement} target
 */

function animateIntoView(target) {
  let options = {
    rootMargin: '0px',
    threshold: [0, 0.5, 1]
  };

  let callback = entries => {
    entries.forEach(entry => {
      const ratio = entry.intersectionRatio;
      const {
        top
      } = entry.boundingClientRect;
      const shouldAppear = ratio > 0.5 && top >= 0;
      const shouldHide = ratio === 0 && top >= 0;

      if (shouldAppear) {
        entry.target.classList.add('is-visible');
      } else if (shouldHide) {
        entry.target.classList.remove('is-visible');
      }
    });
  };

  let observer = new IntersectionObserver(callback, options);
  observer.observe(target);
}
},{"./category.js":"scripts/category.js","./state.js":"scripts/state.js"}],"scripts/pagination.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePagination = updatePagination;

var _update = require("./update.js");

var _api = require("./api.js");

const prev = document.getElementById('news-prev');
const next = document.getElementById('news-next');
const current = document.getElementById('news-current-page');
/**
 * Updates the pagination with page number and url
 * @param {Object} data The response object
 * @param {String} url The URL that was fetched
 */

function updatePagination(data, url) {
  // Set current page
  current.innerText = data.page; // Attach the pagination data to the buttons, for previons and next
  // Prev Button

  const prevPage = data.page - 1;

  if (prevPage > 0) {
    prev.setAttribute('data-page', prevPage);
    prev.removeAttribute('disabled');
  } else {
    prev.setAttribute('disabled', true);
  } // Next Button


  const nextPage = data.page + 1;
  next.setAttribute('data-page', nextPage);
}
/**
 * Fetches new data, next or previous page
 * @param {Object} event
 */


async function paginatePage(event) {
  const {
    page
  } = event.target.dataset;
  const response = await (0, _api.fetchData)({
    pageNumber: page
  });
  (0, _update.updatePageUI)(response.data, response.url);
}

next.addEventListener('click', paginatePage);
prev.addEventListener('click', paginatePage);
},{"./update.js":"scripts/update.js","./api.js":"scripts/api.js"}],"scripts/update.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePageUI = updatePageUI;

var _newsCard = require("./newsCard.js");

var _pagination = require("./pagination.js");

var _api = require("./api.js");

const newsResults = document.getElementById('news-results');
let store = {};
/**
 * Updates the page when new data has been received
 * @param {Object} data The response data
 * @param {String} url The URL that was fetched
 */

function updatePageUI(data = {
  news: []
}, url = '') {
  store = {
    data,
    url
  };
  newsResults.style.opacity = 0;
  newsResults.addEventListener('transitionend', onTransitionEnd);
}
/**
 * Callback the fade out animation
 * @param {Object} data The response data
 * @param {String} url The URL that was fetched
 */


function appendData() {
  // If there are not search results
  if (store.data.news.length === 0) {
    return searchNotFound();
  } else {
    // Empty the parent 
    newsResults.innerHTML = '';
  } // Build the HTML for the news cards


  store.data.news.map(n => (0, _newsCard.createNewsCard)(n)).forEach(card => newsResults.appendChild(card)); //Pass the search info to the pagination buttons

  (0, _pagination.updatePagination)(store.data, store.url); // Remove the style attribute to show the element again (removes opacity)

  newsResults.removeAttribute('style');
}

function onTransitionEnd(event) {
  if (event.propertyName === 'opacity') {
    newsResults.removeEventListener('transitionend', onTransitionEnd);
    window.scrollTo(0, 0);
    appendData();
  }
}

;

function searchNotFound() {
  const goBack = document.createElement('a');
  goBack.innerText = 'Go Back';
  goBack.href = '#';
  goBack.addEventListener('click', async e => {
    e.preventDefault();
    const {
      data,
      url
    } = await (0, _api.fetchData)({
      latestNews: true
    });
    updatePageUI(data, url);
  });
  newsResults.innerHTML = '<h2 style="margin-bottom: 30px;">Nothing found.</h2>';
  newsResults.appendChild(goBack);
  newsResults.style.cssText = 'text-align: center; padding: 30px; opacity: 1;';
}
},{"./newsCard.js":"scripts/newsCard.js","./pagination.js":"scripts/pagination.js","./api.js":"scripts/api.js"}],"scripts/category.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initCategoryChange = initCategoryChange;
exports.onCategoryTagClick = onCategoryTagClick;

var _update = require("./update.js");

var _api = require("./api.js");

var _filters = require("./filters.js");

const categoriesEl = document.getElementById('select-categories');
/**
 * Change handler for category, also sends a new request for data and updates UI
 */

function initCategoryChange() {
  (0, _filters.loadStoredFilter)('category', categoriesEl);
  categoriesEl.addEventListener('change', onChange);
}

async function onChange(event) {
  const {
    data,
    url
  } = await (0, _api.fetchData)(); // Update the page results

  (0, _update.updatePageUI)(data, url); // Save to local storage

  localStorage.setItem('category', event.target.value);
}
/**
 * The category tags that lay with the news cards
 * @param {Object} event
 */


async function onCategoryTagClick(event) {
  event.preventDefault();
  const {
    category
  } = event.target.dataset;
  const {
    data,
    url
  } = await (0, _api.fetchData)(); // Update the category selector

  categoriesEl.value = category; // Update the page results

  (0, _update.updatePageUI)(data, url); // Save to local storage

  localStorage.setItem('category', category);
}
},{"./update.js":"scripts/update.js","./api.js":"scripts/api.js","./filters.js":"scripts/filters.js"}],"scripts/language.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initLanguageChange = initLanguageChange;

var _update = require("./update.js");

var _api = require("./api.js");

var _filters = require("./filters.js");

const languageEl = document.getElementById('select-language');
/**
 * Initialize the language change events
 */

function initLanguageChange() {
  languageEl.addEventListener('change', onChange);
  (0, _filters.loadStoredFilter)('language', languageEl);
}

async function onChange(event) {
  const {
    data,
    url
  } = await (0, _api.fetchData)();
  const lang = event.target.value; // Update the page results

  (0, _update.updatePageUI)(data, url);
  (0, _filters.updateTrayText)({
    language: event.target
  });
  (0, _filters.closeAllFilters)(); // Save to local storage

  localStorage.setItem('language', lang); // Set the lang on the HTML element

  if (lang !== 'any') {
    document.documentElement.setAttribute('lang', lang);
  }
}
},{"./update.js":"scripts/update.js","./api.js":"scripts/api.js","./filters.js":"scripts/filters.js"}],"scripts/region.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initRegionChange = initRegionChange;

var _update = require("./update.js");

var _api = require("./api.js");

var _filters = require("./filters.js");

const regionsEl = document.getElementById('select-region');
/**
 * Initialize the change events for the region filters
 */

function initRegionChange() {
  regionsEl.addEventListener('change', onChange);
  (0, _filters.loadStoredFilter)('region', regionsEl);
} // Update the page when the region has changed


async function onChange(event) {
  const {
    data,
    url
  } = await (0, _api.fetchData)(); // Update the page results

  (0, _update.updatePageUI)(data, url);
  (0, _filters.updateTrayText)({
    region: event.target
  });
  (0, _filters.closeAllFilters)(); // Save to local storage

  localStorage.setItem('region', event.target.value);
}
},{"./update.js":"scripts/update.js","./api.js":"scripts/api.js","./filters.js":"scripts/filters.js"}],"scripts/date.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDateChange = initDateChange;

var _update = require("./update.js");

var _api = require("./api.js");

var _filters = require("./filters.js");

const startDate = document.getElementById('select-date-start');
const endDate = document.getElementById('select-date-end');
const apply = document.getElementById('filter-date-apply');
let start;
let end;
/**
 * Initialize date change events
 */

function initDateChange() {
  // Add event listeners and pass in an string ID to know which date picker is being picked
  startDate.addEventListener('change', onChange.bind(null, 'startDate'));
  endDate.addEventListener('change', onChange.bind(null, 'endDate')); // This event applies a new search with a specified date range

  apply.addEventListener('click', onApply);
} // Update the start and end variables on user input
// Function statements are hoisted to the top


function onChange(type, event) {
  if (type === 'startDate') {
    start = event.target.value;
  }

  if (type === 'endDate') {
    end = event.target.value;
  }
} // Seperate action to make sure there is a date range


async function onApply() {
  // If start and end dates exist, create a new url
  if (start && end) {
    const {
      data,
      url
    } = await (0, _api.fetchData)(); // Update the page results

    (0, _update.updatePageUI)(data, url);
    (0, _filters.closeAllFilters)();
  }
}
},{"./update.js":"scripts/update.js","./api.js":"scripts/api.js","./filters.js":"scripts/filters.js"}],"scripts/search.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSearch = initSearch;

var _api = require("./api.js");

var _update = require("./update.js");

// Cache Elements
const newsTitle = document.querySelector('h1');
const keywords = document.getElementById('keywords');
const searchForm = document.getElementById('news-form');
const searchButton = document.getElementById('search-button');
/**
 * Initialize the search and add search events
 */

function initSearch() {
  keywords.addEventListener('focus', onSearchFocus);
  keywords.addEventListener('blur', onSearchBlur);
  searchButton.addEventListener("click", onSearchClick);
  newsTitle.addEventListener('click', onTitleClick); // Search on inital load

  onSearchClick();
}
/**
 * Click hanlder that creates a new search URL, fetched the data, and updates the UI
 * @param {Object} event
 */


async function onSearchClick(event) {
  if (event) event.preventDefault();
  const {
    data,
    url
  } = await (0, _api.fetchData)();
  (0, _update.updatePageUI)(data, url);
}

function onSearchFocus() {
  searchForm.classList.add('is-focused');
}

function onSearchBlur() {
  searchForm.classList.remove('is-focused');
}

function onTitleClick() {
  const half = window.scrollY / 2;
  const diff = window.scrollY > half ? window.innerHeight : 0;
  const percent = (window.scrollY + diff) / document.body.clientHeight;
  const timeout = 1000 * percent;
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  setTimeout(async () => {
    const {
      data,
      url
    } = await (0, _api.fetchData)({
      latestNews: true
    });
    (0, _update.updatePageUI)(data, url);
  }, timeout);
}
},{"./api.js":"scripts/api.js","./update.js":"scripts/update.js"}],"scripts/theme.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initTheme = initTheme;
const themeCheckbox = document.getElementById('select-theme');
const themeClassName = 'is-dark-mode';
/**
 * Initialize the change events for the theme
 */

function initTheme() {
  themeCheckbox.addEventListener('change', onChange);
  loadTheme();
}
/**
 * Event to handle theme change
 */


function onChange(event) {
  const {
    checked
  } = event.target;
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
},{}],"scripts/index.js":[function(require,module,exports) {
"use strict";

var _filters = require("./filters.js");

var _category = require("./category.js");

var _language = require("./language.js");

var _region = require("./region.js");

var _date = require("./date.js");

var _search = require("./search.js");

var _theme = require("./theme.js");

/**
 * Initializes modules
 */
async function startApp() {
  // Initialize
  await (0, _filters.initFilters)();
  (0, _category.initCategoryChange)();
  (0, _language.initLanguageChange)();
  (0, _region.initRegionChange)();
  (0, _date.initDateChange)();
  (0, _search.initSearch)();
  (0, _theme.initTheme)();
}

startApp();
},{"./filters.js":"scripts/filters.js","./category.js":"scripts/category.js","./language.js":"scripts/language.js","./region.js":"scripts/region.js","./date.js":"scripts/date.js","./search.js":"scripts/search.js","./theme.js":"scripts/theme.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55846" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","scripts/index.js"], null)
//# sourceMappingURL=/scripts.bcf3243b.js.map