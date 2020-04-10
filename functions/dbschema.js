let db = {
    users: [
        {
            userId: 'aYVeYujGmZQv90PtF5h94UDGZ092',
            email: 'zzz@wp.pl',
            handle: 'zus',
            createdAt: '2020-04-09T13:33:23.960Z',
            imegeUrl: 'https://firebasestorage.googleapis.com/v0/b/socialape-659f4.appspot.com/o/8291586.png?alt=media',
            bio: 'someting about me',
            website: 'example.com',
            location: 'Warsaw, Poland'

        }
    ],
    screams: [
        {
            userHandle: 'user',
            body: 'this is the scream body',
            createdAt: '2020-04-08T16:47:42.170Z',
            likeCount: 5,
            commentCount: 2
        }
    ]
};

const userDetails = {
    // Redux data
    credentials: {
        userId: 'KJLFSDKL34KJFDKJ4934JKLFDS',
        email: 'user@example.com',
        handle: 'user',
        createdAt: '2020-04-09T13:33:23.960Z',
        imageUrl: 'image/dsdsdds/dsddds',
        bio: 'Hello, my name is user, nice to meet you',
        website: 'https://example.com',
        location: 'Louisville, LA'
    },
    likes: [
        {
            userHandle: 'user',
            screamId: 'jsds3432klsd333'
        }, {
            userHandle: 'user',
            screamId: 'jdal223893lfdsfj3'
        }
    ]
};
