const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('../admin_keys.json');
const express = require('express');
const app = express();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://socialape-659f4.firebaseio.com'
});

app.get('/screams', (req, res) => {
    admin
        .firestore()
        .collection('screams')
        .get()
        .then(data => {
            const screams = [];
            data.forEach(document => screams.push(document.data()));
            return res.json(screams);
        })
        .catch(err => console.log(err));
});


exports.createScream = functions.https.onRequest((req, res) => {
    if (req.method !== 'POST') {
        return res.status(400).json({ error: 'method not allowed, use POST instead' });
    }
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date)
    };
    admin.firestore()
        .collection('screams')
        .add(newScream)
        .then(doc => res.json({ message: `document ${doc.id} created successfully` }))
        .catch(err => res.status(500).json({ error: `there was a following error ${err}` }));
});

exports.api = functions.https.onRequest(app);
