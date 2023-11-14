import config from './supabase/config.js';

const Modelo = {

  async iniciarSesion(username, password) {
    const datos_insertar = {
      usuario: username,
      contrasena: password
    }

    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:5000/iniciar-sesion",
      data: datos_insertar,
      headers: config.headers,
    });
    return res;
  },

}

const Vista = {
  getDatosIniciarSesion() {
    const username = document.querySelector('#userName').value;
    const password = document.querySelector('#userPass').value;
    return { username, password };
  },
  
  mostrarMensajeError(mensaje) {
    console.log(mensaje)
  },

  mostrarMensajeSatisfactorio(mensaje) {
    console.log(mensaje);
  },

  redirigirAlUsuario() {
    location.href = ("../index.html");
  },

  redirigirMedico() {
    location.href = ("./medico.html");
  },

  redirigirNotificador() {
    location.href = ("./area_notificaciones.html");
  },

}

const Controlador = {

  async iniciarSesion() {
    const { username, password } = Vista.getDatosIniciarSesion();
    try {
      const res = await Modelo.iniciarSesion(username, password);
      if (res.data.acceso == true) {
        const access_token = res.data.access_token;
        const id_paciente = res.data.id_paciente;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("id_paciente", id_paciente);

        if (res.data.rol == "usuario"){
          Vista.redirigirAlUsuario();
        }

        if(res.data.rol == "medico"){
          Vista.redirigirMedico();
        }

        if(res.data.rol == "notificador"){
          Vista.redirigirNotificador();
        }

      } else {
        Vista.mostrarMensajeError("Usuario no encontrado")
      }

    } catch (err) {
      Vista.mostrarMensajeError('Error al iniciar sesión');
      console.log(err);
    }
  },

}

document.addEventListener('DOMContentLoaded', function () {
  /* MODAL Eliminar */
  var modalEliminar = document.getElementById("targetModalIniciarSesion");
  var btnAbrirModalEliminar = document.getElementById("btnAbrirIniciarSesionModal");
  var btnCerrarModalEliminar = document.getElementsByClassName("cerrar-modal-iniciar-sesion")[0];

  btnAbrirModalEliminar.onclick = function () {
    modalEliminar.style.display = "block";
  }

  btnCerrarModalEliminar.onclick = function () {
    modalEliminar.style.display = "none";
  }

  window.onclick = function (event) {
    if (event.target == modalEliminar) {
      modalEliminar.style.display = "none";
    }
  }

  const btnIniciarSesionModal = document.getElementById('btnIniciarSesionModal');

  btnIniciarSesionModal.onclick = function () {
    Controlador.iniciarSesion()
  }
  
})