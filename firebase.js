import firebase from 'firebase/app';
import 'firebase/auth';

// Firebase Configuration (use your actual credentials!)
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
firebase.initializeApp(firebaseConfig);

// Get references to form elements
const registrationForm = document.getElementById('registrationForm');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('register-form');
const loginFormDiv = document.getElementById('login-form');
const registrationError = document.getElementById('registrationError');
const loginError = document.getElementById('loginError');

// Registration Form Submission Handler
registrationForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Create User with Email and Password
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Registration successful
      console.log("Registration successful!");
      registrationError.textContent = "";
      switchForm();
    })
    .catch((error) => {
      // Registration failed
      console.error("Registration failed!", error);
      registrationError.textContent = "Registration failed. Please check your details.";
    });
});

// Login Form Submission Handler
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Sign in with Email and Password
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Login successful
      console.log("Login successful!");
      loginError.textContent = "";
      // Redirect to dashboard after login (replace with your actual page)
      window.location.href = "/dashboard";
    })
    .catch((error) => {
      // Login failed
      console.error("Login failed!", error);
      loginError.textContent = "Login failed. Please check your details.";
    });
});

// Function to Switch Between Registration and Login Forms
function switchForm() {
  registerForm.style.display = registerForm.style.display === "none" ? "block" : "none";
  loginFormDiv.style.display = loginFormDiv.style.display === "none" ? "block" : "none";
}