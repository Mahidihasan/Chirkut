import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseReady = Object.values(firebaseConfig).every(Boolean);

const app = firebaseReady ? initializeApp(firebaseConfig) : null;

if (!firebaseReady) {
  console.warn("Firebase config is missing. Create .env with VITE_FIREBASE_* variables.");
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export const ensureAuthPersistence = async () => {
  if (!auth) return;
  await setPersistence(auth, browserLocalPersistence);
};

export const usernameToEmail = (username) => {
  const clean = username.trim().toLowerCase();
  return `${clean}@chirkut.app`;
};

