require('dotenv').config();

const axios = require('axios');
const BASE_URL = 'https://api.currentsapi.services/v1';
const KEY = process.env.API_KEY;

exports.search = async function (req, res) {
    let url = `${ BASE_URL }/search?apiKey=${ KEY }`;
    
    const { 
        keywords,
        language,
        country,
        category,
        start_date,
        end_date,
        page_number
    } = req.query;

    if(keywords) {
        url += `&keywords=${ keywords }`;
    }
    if(language) {
        url += `&language=${ language }`;
    }
    if(country) {
        url += `&country=${ country }`;
    }
    if(category) {
        url += `&category=${ category }`;
    }
    if(start_date) {
        url += `&start_date=${ start_date }`;
    }
    if(end_date) {
        url += `&end_date=${ end_date }`;
    }
    if(page_number) {
        url += `&page_number=${ page_number }`;
    }

    const response = await fetch(url).catch(e => console.log(e));

    res.send({ ...response.data });
};

exports.latest = async function (req, res) {
    let url = `${ BASE_URL }/latest-news?apiKey=${ KEY }`;
    
    const { 
        language,
        page_number
    } = req.query;

    if(language) {
        url += `&language=${ language }`;
    }
    if(page_number) {
        url += `&page_number=${ page_number }`;
    }

    const response = await fetch(url).catch(e => console.log(e));

    res.send({ ...response.data });
};

exports.filters = async function (req, res) {
    let url = `${ BASE_URL }/available/${ req.query.name }?apiKey=${ KEY }`;

    const response = await fetch(url).catch(e => console.log(e));

    res.send({ ...response.data });
};

async function fetch(url) {
    try {
        const response = await axios.get(url);
        if(response) {
            return response;
        } else {
            throw new Error('Something went wrong. No response data.');
        }
    } catch(error) {
        console.log(error);
    }
}