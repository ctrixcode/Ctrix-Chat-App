import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Development_Backend = {
  apiKey: process.env.REACT_APP_FIREBASE_DEV_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DEV_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_DEV_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_DEV_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_DEV_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_DEV_APP_ID,
};

const Production_Backend = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const app =
  process.env.NODE_ENV === "development"
    ? initializeApp(Development_Backend)
    : initializeApp(Production_Backend);

// export const app = initializeApp(Development_Backend);

export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
