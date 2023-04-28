const openModal = document.getElementById('openRegisterModal');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeRegisterModal');
const registerForm = document.getElementById('register-form');
const pacientesTable = document.getElementById('pacientes-table');
const updateModal = document.getElementById('modal-update');
const updateForm = document.getElementById('update-form');
const closeUpdateModal = document.getElementById('closeUpdateModal');
const searchInput = document.querySelector("[data-search]");


// Abre y cierra el modal de registro
const showRegisterModal = () => {
  modal.classList.toggle('is-active')
}

openModal.addEventListener('click', showRegisterModal)
closeModal.addEventListener('click', showRegisterModal)


// Envía los datos del formulario a Firebase
registerForm.addEventListener('submit', (e) => {
  e.preventDefault()

  // Obtiene los valores del formulario
  const nombre = registerForm['nombre'].value;
  const apellido = registerForm['apellido'].value;
  const edad = registerForm['edad'].value;
  const domicilio = registerForm['Domicilio'].value;
  const obraSocial = registerForm['Obra Social'].value;
  const nroAFL = registerForm['AFL'].value;
  const telefono = registerForm['cel'].value;
  const correo = registerForm['email'].value;
  const diagnostico = registerForm['DX'].value;
  const doctor = registerForm['Doctor'].value;
  const sesiones = registerForm['desc'].value;
  const dni = registerForm['dni'].value;
  const anotaciones = registerForm['anotaciones'].value;
  const especialidad = "Kinesiología";
  const sexo = registerForm['sexo'].value;
  const tto = registerForm['tto'].value;

  // Crea una nueva referencia para el paciente
  const registerPaciente = pacienteRef.push()

  // Define los datos del paciente
  const pacienteData = {
    nombre: nombre,
    apellido: apellido,
    dni: dni,
    edad: edad,
    domicilio: domicilio,
    obraSocial: obraSocial,
    nroAFL: nroAFL,
    telefono: telefono,
    correo: correo,
    diagnostico: diagnostico,
    doctor: doctor,
    sesiones: sesiones,
    especialidad: especialidad,
    anotaciones: anotaciones,
    sexo: sexo,
    tto: tto
  }

  // Guarda los datos del paciente en Firebase
  registerPaciente.set(pacienteData)
  // Borra los valores del formulario
  registerForm.reset()
  // Cierra el Modal
  showRegisterModal();
})

// Configuración Firebase 
const firebaseConfig = {
  apiKey: "AIzaSyCIFEHbyNwxrsVKXADxHIqwu5CpFD-_TFk",
  authDomain: "pacientes-7d332.firebaseapp.com",
  projectId: "pacientes-7d332",
  storageBucket: "pacientes-7d332.appspot.com",
  messagingSenderId: "957568793653",
  appId: "1:957568793653:web:33eab6f43a27a65940457c"
};

firebase.initializeApp(firebaseConfig);

const pacienteRef = firebase.database().ref('pacientes')


// Función borrar
const deletePaciente = (dni) => {
  firebase.database().ref(`pacientes/${dni}`).remove((error) => {
    if (error) {
      console.log(`Error al borrar el paciente con ID ${dni}: ${error.message}`);
    } else {
      console.log(`Paciente con ID ${dni} eliminado correctamente`);
    }
  });
};


const showUpdateModal = () => {
  updateModal.classList.toggle('is-active')
}

window.addEventListener('DOMContentLoaded', async (e) => {
  await pacienteRef.orderByChild('especialidad').equalTo('Kinesiología').on('value', (pacientes) => {
    pacientesTable.innerHTML = '';
    let pacienteKey; // declarar variable pacienteKey antes del ciclo
    pacientes.forEach((paciente) => {
      let pacienteData = paciente.val();
      pacienteKey = paciente.key; // asignar valor a pacienteKey dentro del ciclo
      pacientesTable.innerHTML += `
          <tr>
            <td>${pacienteData.nombre}</td>
            <td>${pacienteData.apellido}</td>
            <td>${pacienteData.edad}</td>
            <td>${pacienteData.dni}</td>
            <td>${pacienteData.obraSocial}</td>
            <td>${pacienteData.nroAFL}</td>
            <td>${pacienteData.telefono}</td>
            <td>${pacienteData.diagnostico}</td>
            <td>${pacienteData.doctor}</td>
            <td>
              <button class="button is-warning" data-id="${pacienteKey}">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button class="button is-danger" data-id="${pacienteKey}">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `;
    });

    const updateButtons = document.querySelectorAll('.is-warning');

    // Función para limpiar los eventos antiguos
    function cleanUpdateFormEvents() {
      updateForm.removeEventListener('submit', onSubmit);
    }

    // Función que maneja el evento submit del formulario
    function onSubmit(e) {
      e.preventDefault();
      const uid = updateForm.getAttribute('data-id');
      const nombre = updateForm['nombre'].value;
      const apellido = updateForm['apellido'].value;
      const edad = updateForm['edad'].value;
      const domicilio = updateForm['Domicilio'].value;
      const obraSocial = updateForm['Obra Social'].value;
      const nroAFL = updateForm['AFL'].value;
      const telefono = updateForm['cel'].value;
      const correo = updateForm['email'].value;
      const diagnostico = updateForm['DX'].value;
      const doctor = updateForm['Doctor'].value;
      const sesiones = updateForm['desc'].value;
      const dni = updateForm['dni'].value;
      const anotaciones = updateForm['anotaciones'].value;
      const tto = updateForm['tto'].value;

      firebase.database().ref(`pacientes/${uid}`).update({
        nombre: nombre,
        apellido: apellido,
        dni: dni,
        edad: edad,
        domicilio: domicilio,
        obraSocial: obraSocial,
        nroAFL: nroAFL,
        telefono: telefono,
        correo: correo,
        diagnostico: diagnostico,
        doctor: doctor,
        sesiones: sesiones,
        anotaciones: anotaciones,
        tto: tto
      });

      cleanUpdateFormEvents(); // Limpia los eventos antiguos antes de agregar uno nuevo
      updateForm.addEventListener('submit', onSubmit); // Agrega el evento submit al formulario
      showUpdateModal();
    }

    updateButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        const pacienteKey = button.getAttribute('data-id');
        showUpdateModal();
        firebase.database()
          .ref(`pacientes/${pacienteKey}`)
          .once('value')
          .then((paciente) => {
            const dataPaciente = paciente.val()
            updateForm.setAttribute('data-id', pacienteKey);
            updateForm['nombre'].value = dataPaciente.nombre;
            updateForm['apellido'].value = dataPaciente.apellido;
            updateForm['edad'].value = dataPaciente.edad;
            updateForm['Domicilio'].value = dataPaciente.domicilio;
            updateForm['Obra Social'].value = dataPaciente.obraSocial;
            updateForm['AFL'].value = dataPaciente.nroAFL;
            updateForm['cel'].value = dataPaciente.telefono;
            updateForm['email'].value = dataPaciente.correo;
            updateForm['DX'].value = dataPaciente.diagnostico;
            updateForm['Doctor'].value = dataPaciente.doctor;
            updateForm['desc'].value = dataPaciente.sesiones;
            updateForm['dni'].value = dataPaciente.dni;
            updateForm['anotaciones'].value = dataPaciente.anotaciones;
            updateForm['tto'].value = dataPaciente.tto;

          });
        // Limpiar eventos antiguos
        cleanUpdateFormEvents();
        // Agregar evento submit al formulario
        updateForm.addEventListener('submit', onSubmit);
      });
    });
    const deleteButtons = document.querySelectorAll('.is-danger');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        const dni = button.getAttribute('data-id');
        const confirmDelete = confirm("¿Estás seguro que quieres borrar el registro?");
        if (confirmDelete) {
          deletePaciente(dni);
        }
      });
    });
  });
});


// Si se presiona esc se cierra el modal
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.key === "Esc") {
    showUpdateModal();
  }
});

// Cuando se hace click en la x del modal se cierra
closeUpdateModal.addEventListener('click', showUpdateModal)


function buscarPacientes(textoBusqueda) {
  // Verificar si el texto de búsqueda está vacío
  if (textoBusqueda === "") {
    // Obtener todos los pacientes de la base de datos
    pacienteRef.on("value", function (snapshot) {
      // Elimina los resultados previos de la tabla
      var table = document.getElementById("pacientes-table");
      table.innerHTML = "";

      // Agrega los nuevos resultados a la tabla
      snapshot.forEach(function (childSnapshot) {
        var pacienteKey = childSnapshot.key;
        var pacienteData = childSnapshot.val();
        if (pacienteData.especialidad === "Kinesiología") { // verificar si la propiedad especialidad es igual a Kinesiologia
          table.innerHTML += `
          <tr>
            <td>${pacienteData.nombre}</td>
            <td>${pacienteData.apellido}</td>
            <td>${pacienteData.edad}</td>
            <td>${pacienteData.dni}</td>
            <td>${pacienteData.obraSocial}</td>
            <td>${pacienteData.nroAFL}</td>
            <td>${pacienteData.telefono}</td>
            <td>${pacienteData.diagnostico}</td>
            <td>${pacienteData.doctor}</td>
            <td>
              <button class="button is-warning" data-id="${pacienteKey}">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button class="button is-danger" data-id="${pacienteKey}">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `;
        }
        const updateButtons = document.querySelectorAll('.is-warning');

        // Función para limpiar los eventos antiguos
        function cleanUpdateFormEvents() {
          updateForm.removeEventListener('submit', onSubmit);
        }

        // Función que maneja el evento submit del formulario
        function onSubmit(e) {
          e.preventDefault();
          const uid = updateForm.getAttribute('data-id');
          const nombre = updateForm['nombre'].value;
          const apellido = updateForm['apellido'].value;
          const edad = updateForm['edad'].value;
          const domicilio = updateForm['Domicilio'].value;
          const obraSocial = updateForm['Obra Social'].value;
          const nroAFL = updateForm['AFL'].value;
          const telefono = updateForm['cel'].value;
          const correo = updateForm['email'].value;
          const diagnostico = updateForm['DX'].value;
          const doctor = updateForm['Doctor'].value;
          const sesiones = updateForm['desc'].value;
          const dni = updateForm['dni'].value;
          const anotaciones = updateForm['anotaciones'].value;
          const tto = updateForm['tto'].value;

          firebase.database().ref(`pacientes/${uid}`).update({
            nombre: nombre,
            apellido: apellido,
            dni: dni,
            edad: edad,
            domicilio: domicilio,
            obraSocial: obraSocial,
            nroAFL: nroAFL,
            telefono: telefono,
            correo: correo,
            diagnostico: diagnostico,
            doctor: doctor,
            sesiones: sesiones,
            anotaciones: anotaciones,
            tto: tto
          });
          showUpdateModal();
        }

        updateButtons.forEach((button) => {
          button.addEventListener('click', (e) => {
            const pacienteKey = button.getAttribute('data-id');
            showUpdateModal();
            firebase.database()
              .ref(`pacientes/${pacienteKey}`)
              .once('value')
              .then((paciente) => {
                const dataPaciente = paciente.val()
                updateForm.setAttribute('data-id', pacienteKey);
                updateForm['nombre'].value = dataPaciente.nombre;
                updateForm['apellido'].value = dataPaciente.apellido;
                updateForm['edad'].value = dataPaciente.edad;
                updateForm['Domicilio'].value = dataPaciente.domicilio;
                updateForm['Obra Social'].value = dataPaciente.obraSocial;
                updateForm['AFL'].value = dataPaciente.nroAFL;
                updateForm['cel'].value = dataPaciente.telefono;
                updateForm['email'].value = dataPaciente.correo;
                updateForm['DX'].value = dataPaciente.diagnostico;
                updateForm['Doctor'].value = dataPaciente.doctor;
                updateForm['desc'].value = dataPaciente.sesiones;
                updateForm['dni'].value = dataPaciente.dni;
                updateForm['anotaciones'].value = dataPaciente.anotaciones;
                updateForm['tto'].value = dataPaciente.tto;

              });
            // Limpiar eventos antiguos
            cleanUpdateFormEvents();
            // Agregar evento submit al formulario
            updateForm.addEventListener('submit', onSubmit);
          });
        });



        const deleteButtons = document.querySelectorAll('.is-danger');
        deleteButtons.forEach((button) => {
          button.addEventListener('click', (e) => {
            const dni = button.getAttribute('data-id');
            const confirmDelete = confirm("¿Estás seguro que quieres borrar el registro?");
            if (confirmDelete) {
              deletePaciente(dni);
            }
          });
        });
      }
      )
    }
    )
  }
  else {
    // Realiza la búsqueda en Realtime Database
    pacienteRef.orderByChild("apellido").on("value", function (snapshot) {
      // Elimina los resultados previos de la tabla
      var table = document.getElementById("pacientes-table");
      table.innerHTML = "";

      // Normaliza el texto de búsqueda
      var textoBusquedaNormalizado = textoBusqueda.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      // Agrega los nuevos resultados a la tabla
      snapshot.forEach(function (childSnapshot) {
        var pacienteKey = childSnapshot.key;
        var pacienteData = childSnapshot.val();
        if (pacienteData.especialidad === "Kinesiología") {
          // Normaliza el apellido del paciente para compararlo con el texto de búsqueda normalizado
          var apellidoNormalizado = pacienteData.apellido.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

          // Compara el apellido normalizado del paciente con el texto de búsqueda normalizado
          if (apellidoNormalizado.toLowerCase().indexOf(textoBusquedaNormalizado.toLowerCase()) !== -1) {
            table.innerHTML += `
            <tr>
              <td>${pacienteData.nombre}</td>
              <td>${pacienteData.apellido}</td>
              <td>${pacienteData.edad}</td>
              <td>${pacienteData.dni}</td>
              <td>${pacienteData.obraSocial}</td>
              <td>${pacienteData.nroAFL}</td>
              <td>${pacienteData.telefono}</td>
              <td>${pacienteData.diagnostico}</td>
              <td>${pacienteData.doctor}</td>
              <td>
                <button class="button is-warning" data-id="${pacienteKey}">
                  <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="button is-danger" data-id="${pacienteKey}">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
        `;
          }
        }
      });

      const updateButtons = document.querySelectorAll('.is-warning');

      // Función para limpiar los eventos antiguos
      function cleanUpdateFormEvents() {
        updateForm.removeEventListener('submit', onSubmit);
      }

      // Función que maneja el evento submit del formulario
      function onSubmit(e) {
        e.preventDefault();
        const uid = updateForm.getAttribute('data-id');
        const nombre = updateForm['nombre'].value;
        const apellido = updateForm['apellido'].value;
        const edad = updateForm['edad'].value;
        const domicilio = updateForm['Domicilio'].value;
        const obraSocial = updateForm['Obra Social'].value;
        const nroAFL = updateForm['AFL'].value;
        const telefono = updateForm['cel'].value;
        const correo = updateForm['email'].value;
        const diagnostico = updateForm['DX'].value;
        const doctor = updateForm['Doctor'].value;
        const sesiones = updateForm['desc'].value;
        const dni = updateForm['dni'].value;
        const anotaciones = updateForm['anotaciones'].value;
        const tto = updateForm['tto'].value;

        firebase.database().ref(`pacientes/${uid}`).update({
          nombre: nombre,
          apellido: apellido,
          dni: dni,
          edad: edad,
          domicilio: domicilio,
          obraSocial: obraSocial,
          nroAFL: nroAFL,
          telefono: telefono,
          correo: correo,
          diagnostico: diagnostico,
          doctor: doctor,
          sesiones: sesiones,
          anotaciones: anotaciones,
          tto: tto
        });
        showUpdateModal();
      }

      updateButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
          const pacienteKey = button.getAttribute('data-id');
          showUpdateModal();
          firebase.database()
            .ref(`pacientes/${pacienteKey}`)
            .once('value')
            .then((paciente) => {
              const dataPaciente = paciente.val()
              updateForm.setAttribute('data-id', pacienteKey);
              updateForm['nombre'].value = dataPaciente.nombre;
              updateForm['apellido'].value = dataPaciente.apellido;
              updateForm['edad'].value = dataPaciente.edad;
              updateForm['Domicilio'].value = dataPaciente.domicilio;
              updateForm['Obra Social'].value = dataPaciente.obraSocial;
              updateForm['AFL'].value = dataPaciente.nroAFL;
              updateForm['cel'].value = dataPaciente.telefono;
              updateForm['email'].value = dataPaciente.correo;
              updateForm['DX'].value = dataPaciente.diagnostico;
              updateForm['Doctor'].value = dataPaciente.doctor;
              updateForm['desc'].value = dataPaciente.sesiones;
              updateForm['dni'].value = dataPaciente.dni;
              updateForm['anotaciones'].value = dataPaciente.anotaciones;
              updateForm['tto'].value = dataPaciente.tto;

            });
          // Limpiar eventos antiguos
          cleanUpdateFormEvents();
          // Agregar evento submit al formulario
          updateForm.addEventListener('submit', onSubmit);
        });
      });



      const deleteButtons = document.querySelectorAll('.is-danger');
      deleteButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
          const dni = button.getAttribute('data-id');
          const confirmDelete = confirm("¿Estás seguro que quieres borrar el registro?");
          if (confirmDelete) {
            deletePaciente(dni);
          }
        });
      });
    }
    )
  }
}



// Agrega un evento al campo de búsqueda
document.getElementById("search").addEventListener("input", function (event) {
  // Si se presiona la tecla Enter, realiza la búsqueda
  // if (event.key === "Enter") {
  buscarPacientes(event.target.value);
}
);

// Obtener los elementos del DOM
const logoutButton = document.querySelector('#logout-button');
let userEmail = document.querySelector('#user-email');

// Manejar el botón de cerrar sesión
logoutButton.addEventListener('click', (e) => {
  e.preventDefault();
  firebase.auth().signOut().then(() => {
    // Redirigir al usuario a la página de inicio de sesión
    window.location.href = 'login.html';
  }).catch((error) => {
    console.error(error);
  });
});

// Actualizar el correo electrónico del usuario en la barra de navegación
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    if (user.email === 'kinesiologiaintegral@gmail.com') {
      userEmail.textContent = 'Ana la Jefa';
    } else if (user.email === 'susanalazarte@kinesiologia.com') {
      userEmail.textContent = 'Susana Lazarte';
    } else if (user.email === 'inessalzano@kinesiologia.com') {
      userEmail.textContent = 'Inés Salzano'
    }
  }
});

