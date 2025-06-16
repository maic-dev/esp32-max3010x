import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDL6SSppa0BY_v5V98QaEUnD54URsONySM",
  authDomain: "esp32-max30102-78020.firebaseapp.com",
  databaseURL: "https://esp32-max30102-78020-default-rtdb.firebaseio.com",
  projectId: "esp32-max30102-78020",
  storageBucket: "esp32-max30102-78020.firebasestorage.app",
  messagingSenderId: "529435742114",
  appId: "1:529435742114:web:41b3af67f12ce653b26cfb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
export const dbfirestore = getFirestore();