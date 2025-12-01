import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3olEmzo7d0wVIHlUPVJ3KKrBCsQMw-j4",
  authDomain: "ommcraxyyuu.firebaseapp.com",
  projectId: "ommcraxyyuu",
  storageBucket: "ommcraxyyuu.firebasestorage.app",
  messagingSenderId: "158338813628",
  appId: "1:158338813628:web:41f60f074a33c0db7d0ab9",
  measurementId: "G-7XLVV6EWHF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);