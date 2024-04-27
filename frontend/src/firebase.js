// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "e-commerce-847de.firebaseapp.com",
  projectId: "e-commerce-847de",
  storageBucket: "e-commerce-847de.appspot.com",
  messagingSenderId: "410748206610",
  appId: "1:410748206610:web:eb712e9c561d565b9fa2cb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);