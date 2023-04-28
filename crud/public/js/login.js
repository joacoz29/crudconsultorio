// Configuracion de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCIFEHbyNwxrsVKXADxHIqwu5CpFD-_TFk",
    authDomain: "pacientes-7d332.firebaseapp.com",
    projectId: "pacientes-7d332",
    storageBucket: "pacientes-7d332.appspot.com",
    messagingSenderId: "957568793653",
    appId: "1:957568793653:web:33eab6f43a27a65940457c"
  };

  // Inicializa Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Obtiene los elementos del DOM
  const loginForm = document.querySelector('#login-form');
  const errorMessage = document.querySelector('#error-message');
  
  // Agrega el evento submit al formulario de inicio de sesión
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    // Obtiene los valores del formulario
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;
  
    // Inicia sesión con Firebase Authentication
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Si el inicio de sesión es exitoso, redirige al usuario a la página de inicio
        window.location.href = 'index.html';
      })
      .catch((error) => {
        // Si el inicio de sesión falla, muestra un mensaje de error
        errorMessage.textContent = error.message;
      });
  });
  