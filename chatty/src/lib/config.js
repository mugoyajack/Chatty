import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
  apiKey: "AIzaSyA8QM05Ki9qEelGpQUStkRcboZ2r9vAPN0",
  authDomain: "chatit-aadf2.firebaseapp.com",
  databaseURL: "https://chatit-aadf2-default-rtdb.firebaseio.com",
  projectId: "chatit-aadf2",
  storageBucket: "chatit-aadf2.appspot.com",
  messagingSenderId: "1014074031139",
  appId: "1:1014074031139:web:6a982b59d444528b8d0596",
  measurementId: "G-MF74DY7QC3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const auth = getAuth(app);

const messagesRef = collection(db, "messages");
const groupMessagesRef = collection(db, "messages");
const usersRef = collection(db, "users");
const groupId = "2rRnQ5d8dxRQN5rGaQ2oWDMVXDE3";

export { db, auth, messagesRef, groupMessagesRef, usersRef, groupId };

