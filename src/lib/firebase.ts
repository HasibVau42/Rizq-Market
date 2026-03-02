import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDEqq1W4Xk5y6J_OV7iY3-1B0N7uAZxY4I",
  authDomain: "rizq-market.firebaseapp.com",
  projectId: "rizq-market",
  storageBucket: "rizq-market.firebasestorage.app",
  messagingSenderId: "1045852283074",
  appId: "1:1045852283074:web:5548c01c4f5ebc3aa11b5b",
  measurementId: "G-6M6FNNX1JF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
