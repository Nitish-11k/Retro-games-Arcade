// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";

/**
 * IMPORTANT: To fix "auth/unauthorized-domain" errors for Google Sign-in:
 * 
 * 1. Go to Firebase Console: https://console.firebase.google.com/
 * 2. Select your project: retrogamesarcade-541fd
 * 3. Navigate to Authentication > Settings > Authorized domains
 * 4. Add your domains (check browser console for exact domain):
 *    - For local development: localhost (or 127.0.0.1)
 *    - For production: retroarcade.in
 *    - Firebase default: retrogamesarcade-541fd.firebaseapp.com
 *    - Firebase hosting: retrogamesarcade-541fd.web.app
 *    - Any preview URLs: retrogamesarcade-541fd--pr123-abc123.web.app
 * 
 * TROUBLESHOOTING:
 * - Domain must match EXACTLY (no www, http/https, or ports)
 * - Check browser console for debug info showing current domain
 * - Try clearing browser cache and cookies
 * - Firebase changes can take a few minutes to propagate
 * - For localhost, try both "localhost" and "127.0.0.1"
 */

// Your web app's Firebase configuration (prefer env vars; fallback to defaults for dev)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAoLg5riuHFhqWtwGMCB88InEkSrBUOds8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "retrogamesarcade-541fd.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "retrogamesarcade-541fd",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "retrogamesarcade-541fd.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "257515935226",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:257515935226:web:d8c18e55f3c8b519818043",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-L2X7Q0DR59",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
// Ensure persistent sessions in the browser
try {
  void setPersistence(auth, browserLocalPersistence);
} catch {
  // no-op (e.g., during SSR)
}
const db = getFirestore(app);

// Initialize Analytics only in the browser and when supported
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  void isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, analytics };
