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
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    };
    db
        .collection('screams')
        .add(newScream)
        .then(doc => {
            newScream.screamId = doc.id;
            return res.json({ message: `document ${doc.id} created successfully` });
        })
        .catch(err => res.status(500).json({ error: `there was a following error ${err}` }));
};

// Fetch one scream with comments

exports.getScream = (req, res) => {
    let screamData = {};
    db.doc(`/screams/${req.params.screamId}`).get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Scream not found' });
            }
            screamData = doc.data();
            screamData.screamId = doc.id;
            return db
                .collection('comments')
                .orderBy('createdAt', 'desc')
                .where('screamId', '==', req.params.screamId)
                .get();
        })
        .then(data => {
            console.log(screamData);
            screamData.comments = [];
            data.forEach(doc => {
                screamData.comments.push(doc.data());
            });
            return res.json(screamData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

// Comment on a scream

exports.commentOnScream = (req, res) => {
    if (req.body.body.trim() === '') return res.status(400).json({ error: 'Must not be empty' });

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        screamId: req.params.screamId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    };

    db.doc(`screams/${req.params.screamId}`).get()
        .then(doc => {
            console.log(newComment);
            if (!doc.exists) {
                return res.status(404).json({ error: 'Scream not fount' });
            }
            return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
        })
        .then(() => {
            return db.collection('comments').add(newComment);
        })
        .then(() => {
            return res.json(newComment);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

// Like a scream
exports.likeScream = (req, res) => {
    const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
        .where('screamId', '==', req.params.screamId).limit(1);
    const screamDocument = db.doc(`screams/${req.params.screamId}`);
    const newLike = {
        screamId: req.params.screamId,
        userHandle: req.user.handle
    };
    let screamData = {};
    screamDocument.get()
        .then(doc => {
            if (doc.exists) {
                screamData = doc.data();
                screamData.screamId = doc.id;
                return likeDocument.get();
            } else {
                return res.status(404).json({ error: 'Scream not found' });
            }
        })
        .then(data => {
            console.log(data);
            if (data.empty) {
                return db.collection('likes').add(newLike)
                    .then(() => {
                        screamData.likeCount++;
                        return screamDocument.update({ likeCount: screamData.likeCount });
                    })
                    .then(() => res.json(screamData));
            } else {
                return res.status(400).json({ error: 'Scream already liked' });
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

// Unlike a scream
exports.unlikeScream = (req, res) => {
    const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
        .where('screamId', '==', req.params.screamId).limit(1);
    const screamDocument = db.doc(`screams/${req.params.screamId}`);

    let screamData = {};
    screamDocument.get()
        .then(doc => {
            if (doc.exists) {
                screamData = doc.data();
                screamData.screamId = doc.id;
                return likeDocument.get();
            } else {
                return res.status(404).json({ error: 'Scream not found' });
            }
        })
        .then(data => {
            console.log(data.docs[0].id);
            if (!data.empty) {
                return db.doc(`/likes/${data.docs[0].id}`).delete()
                    .then(() => {
                        screamData.likeCount--;
                        return screamDocument.update({ likeCount: screamData.likeCount });
                    })
                    .then(() => res.json(screamData));
            } else {
                return res.status(400).json({ error: 'Scream already unliked' });
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

// Delete scream
exports.deleteScream = (req, res) => {
    const document = db.doc(`screams/${req.params.screamId}`);
    document.get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Scream not fount' });
            }
            if (doc.data().userHandle !== req.user.handle) {
                return res.statu(403).json({ error: 'Unauthorized' });
            } else {
                return document.delete();
            }
        })
        .then(() => {
            return res.json({ message: 'Scream deleted successfully' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};
