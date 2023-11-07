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
        const resData = res.data;
        const access_token = resData.access_token;
        const nombreUsuario = resData.nombre;
        const id_paciente = resData.id_paciente;

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("usuario", nombreUsuario);
        localStorage.setItem("id_paciente", id_paciente);

        if (resData.rol === "usuario") {
          Vista.redirigirAlUsuario();
        } else if (resData.rol === "medico") {
          Vista.redirigirMedico();
        } else if (resData.rol === "notificador") {
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

  async obtenerTodosAlquileres() {
    try {
      const response = await Modelo.traerRecordatorios(id_paciente);
      Vista.mostrarPropiedades(response.data);
    } catch (err) {
      console.log(err);
      Vista.mostrarMensajeError(err);
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