// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKuZQnJaABGmLAxaUyKdh3ZcDa0Hp9DJw",
  authDomain: "spaceofc.firebaseapp.com",
  projectId: "spaceofc",
  storageBucket: "spaceofc.appspot.com",
  messagingSenderId: "234719113368",
  appId: "1:234719113368:web:831f103ef8a6f4352560ed",
  measurementId: "G-P3E0CFC82W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);