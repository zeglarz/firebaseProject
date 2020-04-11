const functions = require('firebase-functions');
const app = require('express')();

const { getAllScreams, postOneScream, getScream, commentOnScream, likeScream, unlikeScream, deleteScream } = require('./handlers/screams');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users');
const FBAuth = require('./util/auth');
const { db } = require('./util/admin');
// Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);
app.get('/scream/:screamId', getScream);
app.delete('/scream/:screamId', FBAuth, deleteScream);
app.get('/scream/:screamId/like', FBAuth, likeScream);
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream);
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);

// User routes
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);


// Auth routes
app.post('/signup', signup);
app.post('/login', login);

exports.api = functions.region('us-east1').https.onRequest(app);

exports.createNotificationOnLike = functions.region('us-east1').firestore.document('likes/{id}')
    .onCreate(snapshot => {
        db.doc(`/screams/${snapshot.data.screamId}`).get()
            .then(doc => {
                if (doc.exists) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Data().toISOString(),
                        recipient: doc.data().userHandle,
                        type: 'like',
                        read: false,
                        screamId: doc.id
                    });
                }
            })
            .catch(err => {
                console.error(err);
                return;
            });
    });

exports.createNotificationOnComment = functions.region('us-east1').firestore.document('comments/{id}')
    .onCreate(snapshot => {
        db.doc(`/screams/${snapshot.data.screamId}`).get()
            .then(doc => {
                if (doc.exists) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Data().toISOString(),
                        recipient: doc.data().userHandle,
                        type: 'comment',
                        read: false,
                        screamId: doc.id
                    });
                }
            })
            .catch(err => {
                console.error(err);
                return;
            });
    });


