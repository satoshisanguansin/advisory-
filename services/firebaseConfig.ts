import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// Your web app's Firebase configuration from the prompt
const firebaseConfig = {
  apiKey: "AIzaSyAYs0bMSqD8fPJQHWrzxoZV5iMj-mY9HxM",
  authDomain: "people-advisor-25e86.firebaseapp.com",
  projectId: "people-advisor-25e86",
  storageBucket: "people-advisor-25e86.appspot.com",
  messagingSenderId: "1098640218795",
  appId: "1:1098640218795:web:4839c9ae37efb060db75ee",
  measurementId: "G-Q8YJ49YPCB"
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

try {
    // Initialize Firebase
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    console.log("Firebase initialized successfully. Using Firestore as the primary database.");
} catch (error) {
    console.error("Firebase initialization failed. The app will fall back to local storage (IndexedDB).", error);
    // app and db will be undefined, services will use this to fall back.
}

export { app, db };