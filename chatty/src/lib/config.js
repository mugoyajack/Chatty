import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
    apiKey: "AIzaSyCu3P1xnHFJnWn5Sh22MEARDtlq2cs7BGk",
    authDomain: "chatty-1d579.firebaseapp.com",
    databaseURL: "https://chatty-1d579-default-rtdb.firebaseio.com",
    projectId: "chatty-1d579",
    storageBucket: "chatty-1d579.appspot.com",
    messagingSenderId: "959746801913",
    appId: "1:959746801913:web:ff66714dd2d5ee8cabe228",
    measurementId: "G-0G5MBHQ978",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const auth = getAuth(app);

const messagesRef = collection(db, "messages");
const groupMessagesRef = collection(db, "messages");
const usersRef = collection(db, "users");
const groupId = "P5P34bFraiT4i3qorOheAUSp31j1";

export { db, auth, messagesRef, groupMessagesRef, usersRef, groupId };

