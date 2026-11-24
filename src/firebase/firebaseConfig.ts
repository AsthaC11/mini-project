

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB8urD7__CysNKxNKYYx7gStweK9HcYnH4",
  authDomain: "mini-project-74d0e.firebaseapp.com",
  projectId: "mini-project-74d0e",
  storageBucket: "mini-project-74d0e.firebasestorage.app",
  messagingSenderId: "1031308323993",
  appId: "1:1031308323993:web:57cacfe4075289a7e7dc08",
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
