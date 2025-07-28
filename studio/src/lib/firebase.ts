// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "pixel-playground-vayvx",
  appId: "1:504459363139:web:899bf961f0ae150a1d65f6",
  storageBucket: "pixel-playground-vayvx.firebasestorage.app",
  apiKey: "AIzaSyDNuUsvP3sB8HNgwOtuA_gNbiCohXtFd5I",
  authDomain: "pixel-playground-vayvx.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "504459363139"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
