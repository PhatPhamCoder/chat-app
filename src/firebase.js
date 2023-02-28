import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB5gMlw-E3k3vBYfdP8pe19vWbZhyCr2jQ",
    authDomain: "chat-app-75a86.firebaseapp.com",
    projectId: "chat-app-75a86",
    storageBucket: "chat-app-75a86.appspot.com",
    messagingSenderId: "711261604192",
    appId: "1:711261604192:web:0d15ce06004a0677e03605"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
