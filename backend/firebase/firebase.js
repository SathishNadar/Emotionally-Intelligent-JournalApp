// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMrC6pc-B8jQnQqkZbI054nfmdUHp5jOQ",
  authDomain: "fir-testing-a3937.firebaseapp.com",
  projectId: "fir-testing-a3937",
  storageBucket: "fir-testing-a3937.firebasestorage.app",
  messagingSenderId: "1089715093086",
  appId: "1:1089715093086:web:2a89b70e67132b4ecabecf",
  measurementId: "G-FVG8VFSSB5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app)
export const Auth = getAuth(app);
export default app;