# Requirements

Your app, on page load, should:

## Drop-Down Data
- [x] Prefetch the categories, languages, and regions
- [x] Use LocalStorage when possible
- [x] Use fetch as a backup

## Search 
Build a search bar which has the following options:
  * [x] A keyword text field which corresponds to the keywords= query string
  * [x] A language select dropdown that corresponds to the language=XX query string. Use the keys from the prefetched data as the display value, and the values as the option value.
  * [x] A region select dropdown, as above, corresponding to country=XX
  * [x] A category select dropdown, as above, corresponding to category=XXXXX both start date and end date. 
  * [x] Date pickers, corresponding to start_date=YYYY-MM-DD and end_date=YYYY-MM-DD (respectively, and in formatting)

When your user interacts with the search bar:
  * If the user fills in no keywords, the search should be to: 
    * https://api.currentsapi.services/v1/latest-news
  * If the user fills in anything, instead build a search string, with the base URL of https://api.currentsapi.services/v1/search. 

See https://currentsapi.services/api/docs/

Either way, fetch the stories and display them to the user. The return will include a current page number.

## Pagination

Allow pagination for the results. 
- [x] If it is Page 1, show a "next" button. 
- [x] If it is page 2 and on, show "next" and "previous" buttons.
- [x] Add page_number to the query parameters to get news articles after the first page.

To do pagination, you'll have to store the most recent search string somewhere...

## News Stories

The stories themselves have a fair amount of data:

- A title for the original article 
- A description of the original article 
- A URL to the original article 
- The author of the original article 
- An image URL 
- A category array 

When you are rendering the articles to the results portion of your app, you should make:

- [x] The URL should be clickable and should open the original article in a new tab
- [x] The image should be clickable and open the original image URL in a new tab (full size vs. your rendered preview size)
- [x] The categories should be shown, comma-separated
- [x] And each should be clickable starting a new search for news articles in that category

## Welcome

- [ ] Display a welcome page, with instructions for the user on how to use the search bar.
