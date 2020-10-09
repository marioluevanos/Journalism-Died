import { onCategoryClick } from './category.js';

/**
 * A map function that gets applied over every iteration
 * @param {Array} data The news data to interate over and create HTML elements
 * @returns {Array} An array of HTMLElements
 */
export function createNewsCard (data) {
    const news = create('div');
    const newsText = createNewsText(data);

    const hasImage = data.image !== 'None';
    if (hasImage) {
        const newsImage = createNewsImage(data);
        news.appendChild(newsImage);
        news.classList.add('has-image');
    }

    news.classList.add('news');
    news.appendChild(newsText);
    return news;
}

function createNewsImage ({ url, image, title }) {
    const newsImage = create('figure');
    const newsLink = createNewsLink({ url });
    const newsPicture = create('img');

    newsImage.classList.add('news-image');
    newsPicture.setAttribute('src', image);
    newsPicture.setAttribute('alt', title);
    newsPicture.setAttribute('loading', 'lazy');
    
    newsLink.appendChild(newsPicture);
    newsImage.appendChild(newsLink);
    return newsImage;
}

function createNewsLink ({ url, title = '' }) {
    const newsLink = create('a');
    newsLink.classList.add('news-link');
    newsLink.setAttribute('href', url);
    newsLink.setAttribute('target', '_blank');
    newsLink.setAttribute('rel', 'noopener');
    newsLink.innerText = title;
    return newsLink;
}

function createNewsFooter({ author, url }) {
    const newsFooter = create('div');
    const newsLink = createNewsLink({ url });
    const icon = createIconExternal();

    if (author) {
        const newsAuthor = create('div');
        const authors = removeHTMLTags(author).split(',').filter(Boolean).map(a => `${ a }<br>`).join('').trim();
        newsAuthor.innerHTML = `By ${ authors }`;
        newsAuthor.classList.add('news-author');
        newsFooter.appendChild(newsAuthor);
    }

    newsLink.innerHTML = `Full Story ${icon}`;
    newsLink.classList.add('underline');
    newsFooter.classList.add('news-footer');
    newsFooter.appendChild(newsLink);
    return newsFooter;
}

function createNewsText ({ 
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
    const newsTitle = createNewsTitle({ title, url });
    const newsDesc = create('p');
    const newsFooter = createNewsFooter({ author, url });
    const descText = removeHTMLTags(description);

    // Add data & text
    newsDesc.innerHTML = descText;

    // Add classes
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

function createNewsMeta (categoriesList, published) {
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
    newsPubDate.innerText = pubDate;    
    
    // Remove categories that are not in the dropdown
    const filteredCat = categoriesList.filter((catText) => {
        if (window.currentsAPI.categories.includes(catText)) {
            return catText;
        }
    });

    // Create categories elemenes for each category and attach a click event listener
    filteredCat.map((catText) => {
        
        const category = create('a');
        category.innerText = `${catText}`;
        category.setAttribute('data-category', catText);
        category.setAttribute('href', '#');
        category.classList.add('news-category', 'underline');
        category.addEventListener('click', onCategoryClick);
        return category;
    })

    // After creating category elements, append them to the newsCategory parent element
    .forEach((category, idx) => {
        newsCategory.appendChild(category);
        const lastEl = filteredCat.length - 1 === idx;
        if(!lastEl) {
            newsCategory.innerHTML += `<span class="separator">•</span>`;
        }
    });

    newsMeta.appendChild(newsCategory);
    newsMeta.appendChild(separator);
    newsMeta.appendChild(newsPubDate);

    return newsMeta;
}

function createNewsTitle ({ title, url }) {
    const newsTitle = create('h2');
    const newsLink = createNewsLink({ title, url });
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
 * @param {String} html Any string containing HTML tags
 * @return {String} HTML tags removed from a string
 */
function removeHTMLTags (html = '') {
    return html.replace(/(<([^>]+)>)|(\\n)/gmi, '');
}

/**
 * @param {String} tag An HTML tag to create
 * @return {HTMLElement} An HTML Element
 */
function create (tag) {
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
function timeTemplate (t, n) {
    return timeTemplates[t] && timeTemplates[t].replace(/%d/i, Math.abs(Math.round(n)));
};

/**
 * @param {String} time ISO String time format
 * @return {String} The time pased since
 */
function timeAgo (time) {
    if(!time)
        return;
    time = time.replace(/\.\d+/, ""); // remove milliseconds
    time = time.replace(/-/, "/").replace(/-/, "/");
    time = time.replace(/T/, " ").replace(/Z/, " UTC");
    time = time.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
    time = new Date(time * 1000 || time);

    const now = new Date();
    const seconds = ((now.getTime() - time) * .001) >> 0;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const years = days / 365;

    return timeTemplates.prefix + (
        seconds < 45 && timeTemplate('seconds', seconds) ||
        seconds < 90 && timeTemplate('minute', 1) ||
        minutes < 45 && timeTemplate('minutes', minutes) ||
        minutes < 90 && timeTemplate('hour', 1) ||
        hours < 24 && timeTemplate('hours', hours) ||
        hours < 42 && timeTemplate('day', 1) ||
        days < 30 && timeTemplate('days', days) ||
        days < 45 && timeTemplate('month', 1) ||
        days < 365 && timeTemplate('months', days / 30) ||
        years < 1.5 && timeTemplate('year', 1) ||
        timeTemplate('years', years)
    ) + timeTemplates.suffix;
};
