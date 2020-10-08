/**
 * Loop through a list, then create and append an <option> element to it's selector
 * @param {String} selector CSS Selector
 * @param {Array | Object} list A list to interate and create an <option> element
 */
export function appendDropDownOptions (selector, list) {
    
    const el = document.querySelector(selector);
    // Check if the list is an Array (without named keys)
    if(list instanceof Array) {
        list.forEach((item) => {
            el.innerHTML += `<option value=${ item }>${ toTitleCase(item) }</option>`;
        });
    } else {
        // If not an Array, then it's an Object with key, value pairs.
        // Create an Array from the object, 
        // with position zero[0] as key and position one[1] as value
        const entries = Object.entries(list);

        // Destructure the params within the arguments
        entries.forEach(([key, value]) => {
            el.innerHTML += `<option value=${ value }>${ toTitleCase(key) }</option>`;
        });
    }
}

/**
 * @param {String} text Some text content
 * @return {String} A text string that is title-cased ex: "Title Cased Example"
 */
function toTitleCase (text = '') {
    return text
        // make array of words
        .split(' ')
        // transform each first letter of word
        .map(word => word.replace(/\w{1}/, match => match.toUpperCase()))
        // join array words with space into string
        .join(' ')
}