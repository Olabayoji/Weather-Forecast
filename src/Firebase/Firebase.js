// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCJJ7gB1xWDjeSmyj12tkqkgOjlwz2vCLc",
  authDomain: "weather-app-cdd44.firebaseapp.com",
  projectId: "weather-app-cdd44",
  storageBucket: "weather-app-cdd44.appspot.com",
  messagingSenderId: "201503788111",
  appId: "1:201503788111:web:c26288c310fa63abf96e3a",
  measurementId: "G-TTJX8CTF5F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const authentication = getAuth(app);
