const IS_DEV = window.location.hostname === 'localhost';
const BASE_URL = IS_DEV ? 'http://localhost:5001/journalism-died/us-central1/api' : 'https://us-central1-journalism-died.cloudfunctions.net/api';

export const state = {
    IS_DEV,
    BASE_URL
};