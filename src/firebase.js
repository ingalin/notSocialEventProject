// firebase.js
import firebase from 'firebase/app';
import 'firebase/database';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCKeisjyR0PZ65xewzPZjJ4508J89N0d08",
    authDomain: "project6-52380.firebaseapp.com",
    projectId: "project6-52380",
    storageBucket: "project6-52380.appspot.com",
    messagingSenderId: "794273931695",
    appId: "1:794273931695:web:4f2fc44a28db6a4778cf5a"
};

firebase.initializeApp(firebaseConfig);
// this exports the CONFIGURED version of firebase
export default firebase;