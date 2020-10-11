const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const {
    databaseURL,
    storageBucket
} = require('./firebase.config');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL,
    storageBucket
});

const db = admin.firestore();

db.settings({ timestampsInSnapshots: true });

module.exports = { admin, db };
