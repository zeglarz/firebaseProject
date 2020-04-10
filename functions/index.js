const functions = require('firebase-functions');
const app = require('express')();

const { getAllScreams, postOneScream } = require('./handlers/screams');
const { signup, login, uploadImage, addUserDetails } = require('./handlers/users');
const FBAuth = require('./util/auth');
// Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);

// Auth routes
app.post('/signup', signup);
app.post('/login', login);

exports.api = functions.region('us-east1').https.onRequest(app);
