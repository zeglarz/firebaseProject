const { db } = require('../util/admin');

exports.getAllScreams = (req, res) => {
    db
        .collection('screams')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            const screams = [];
            data.forEach(doc => screams.push({
                screamId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt
            }));
            return res.json(screams);
        })
        .catch(err => console.log(err));
};

exports.postOneScream = (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString()
    };
    db
        .collection('screams')
        .add(newScream)
        .then(doc => res.json({ message: `document ${doc.id} created successfully` }))
        .catch(err => res.status(500).json({ error: `there was a following error ${err}` }));
};
