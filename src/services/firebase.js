import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId,
);

let appInstance = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  appInstance = initializeApp(firebaseConfig);
  auth = getAuth(appInstance);
  db = getFirestore(appInstance);
  googleProvider = new GoogleAuthProvider();
}

export { auth, db };

export function subscribeToAuthState(callback) {
  if (!auth) {
    callback(null);
    return () => { };
  }
  return onAuthStateChanged(auth, callback);
}

export async function signInWithGoogleUser() {
  if (!auth || !googleProvider) return null;
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutUser() {
  if (!auth) return;
  await signOut(auth);
}
