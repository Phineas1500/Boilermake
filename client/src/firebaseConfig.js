// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdkNTbGG0QxzwV0tiEirw4FK6k8nknY9U",
  authDomain: "stock-sim-c17d8.firebaseapp.com",
  projectId: "stock-sim-c17d8",
  storageBucket: "stock-sim-c17d8.appspot.com",
  messagingSenderId: "494656279502",
  appId: "1:494656279502:web:a0c34d770962021f42119f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Export 'auth'
export const db = getFirestore(app); // Export 'db' if you're using Firestore
