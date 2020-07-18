import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyA5IUOgcAkvl0sAtRXf3eK9ZPn_qIIBU8E",
    authDomain: "instagram-clone-9b76b.firebaseapp.com",
    databaseURL: "https://instagram-clone-9b76b.firebaseio.com",
    projectId: "instagram-clone-9b76b",
    storageBucket: "instagram-clone-9b76b.appspot.com",
    messagingSenderId: "383063868568",
    appId: "1:383063868568:web:cbba2d75d8cc3526ed3ced",
    measurementId: "G-TQN3QQKZK8"
})

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};