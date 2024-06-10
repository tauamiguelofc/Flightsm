import firebase from 'firebase/app';
import 'firebase/auth';

// ... (seu código de configuração do Firebase) 

// Get references to form elements
const registrationForm = document.getElementById('registrationForm');
const loginForm = document.getElementById('loginForm');
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
      // Redirecionar para a página de login após o registro
      window.location.href = "login.html";
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
      // Redirecionar para a página 'agency.html' após o login
      window.location.href = "agency.html"; // Redirecionar para agency.html
    })
    .catch((error) => {
      // Login failed
      console.error("Login failed!", error);
      loginError.textContent = "Login failed. Please check your details.";
    });
});