import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// Your web app's Firebase configuration from the prompt
const firebaseConfig = {
  apiKey: "AIzaSyAYsj-mY9HxM",
  authDomain: "people-6.firebaseapp.com",
  projectId: "people-adv6",
  storageBucket: "people-advis86.appspot.com",
  messagingSenderId: "",
  appId: "1:10989c9ae37efb060db75ee",
  measurementId: "G-9YPCB"
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
