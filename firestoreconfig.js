// Import Firebase app and Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDON4TzkFyucYq7Z1NvU2asKIDcctuJbS8",
  authDomain: "login-form-69d23.firebaseapp.com",
  projectId: "login-form-69d23",
  storageBucket: "login-form-69d23.appspot.com",
  messagingSenderId: "717072888751",
  appId: "1:717072888751:web:82f9813ce0c4191d9d355a"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);         // Export Firestore

