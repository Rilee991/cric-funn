import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBFK-Ls496ycWWk5LCbxsN_CrEc234uJWc",
    authDomain: "cric-funn.firebaseapp.com",
    projectId: "cric-funn",
    storageBucket: "cric-funn.appspot.com",
    messagingSenderId: "54598212608",
    appId: "1:54598212608:web:0d61ca8fc4d6e511b1cce5",
    measurementId: "G-TCZ62L5GHP"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage }