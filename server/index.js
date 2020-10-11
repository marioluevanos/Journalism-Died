const functions = require('firebase-functions');
const app = require('express')();
const cors = require('cors');
const {
    search,
    filters,
    latest
} = require('./controllers/news');

// Express Middleware
app.use(cors({
    origin: [
        'https://journalismdied.com',
        'http://127.0.0.1:5500',
        'https://journalism-died.web.app'
    ]
}));

app.get('/search', search);
app.get('/filters', filters);
app.get('/latest', latest);

// Export the API
exports.api = functions.https.onRequest(app);
