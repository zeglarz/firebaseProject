const functions = require('firebase-functions');
const app = require('express')();

const { getAllScreams, postOneScream } = require('./handlers/screams');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getScream } = require('./handlers/users');
const FBAuth = require('./util/auth');
// Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);
app.get('/scream/:screamId', getScream);
// TODO delete scream
// TODO like a scream
// TODO unlike a scream
// TODO comment a scream

// User routes
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);


// Auth routes
app.post('/signup', signup);
app.post('/login', login);

exports.api = functions.region('us-east1').https.onRequest(app);
