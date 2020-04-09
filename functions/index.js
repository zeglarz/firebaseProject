const functions = require('firebase-functions');
const app = require('express')();

const { getAllScreams, postOneScream } = require('./handlers/screams');
const { signup, login } = require('./handlers/users');
const FBAuth = require('./util/auth');
// Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);

// Auth routes
app.post('/signup', signup);
app.post('/login', login);


exports.api = functions.region('us-east1').https.onRequest(app);
