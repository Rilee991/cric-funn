import firebase from 'firebase';
import moment from 'moment';

const firebaseConfig = {
    apiKey: "AIzaSyBFK-Ls496ycWWk5LCbxsN_CrEc234uJWc",
    authDomain: "cric-funn.firebaseapp.com",
    projectId: "cric-funn",
    storageBucket: "cric-funn.appspot.com",
    messagingSenderId: "54598212608",
    appId: "1:54598212608:web:0d61ca8fc4d6e511b1cce5",
    measurementId: "G-TCZ62L5GHP"
};

let app;
if(firebase.apps.length) {
    app = firebase.app();
} else {
    app = firebase.initializeApp(firebaseConfig);
}

const firebaseNotifs = firebase.messaging(app);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const logger = firebase.analytics(app);
logger.setAnalyticsCollectionEnabled(true);

export { db, auth, storage, firebaseNotifs, logger, firebase };
