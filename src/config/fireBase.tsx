import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsWCrEyeVbtSbM0EeKme5lp01K4o-X3Ac",
  authDomain: "me-to-do-list.firebaseapp.com",
  projectId: "me-to-do-list",
  storageBucket: "me-to-do-list.firebasestorage.app",
  messagingSenderId: "75950404407",
  appId: "1:75950404407:web:22151d1ebb7de3763aa0b2",
  measurementId: "G-X4XEX0G97P"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();