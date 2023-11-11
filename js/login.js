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

  

  mostrarDatosCSV: function (datos) {
    const tablaDatosCSV = document.getElementById('tablaDatos');
    tablaDatosCSV.innerHTML = ''; // Limpiar contenido existente

    // Crear la fila de encabezados
    const encabezadoRow = document.createElement('tr');
    for (const encabezado of Object.keys(datos[0])) {
      const th = document.createElement('th');
      th.textContent = encabezado;
      encabezadoRow.appendChild(th);
    }
    tablaDatosCSV.appendChild(encabezadoRow);

    // Crear las filas de datos
    datos.forEach(dato => {
      const fila = document.createElement('tr');
      for (const prop in dato) {
        const celda = document.createElement('td');
        celda.textContent = dato[prop];
        fila.appendChild(celda);
      }
      tablaDatosCSV.appendChild(fila);
    });

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

  

}

const Controlador = {

  async iniciarSesion() {
    const { username, password } = Vista.getDatosIniciarSesion();
    try {
      const res = await Modelo.iniciarSesion(username, password);
      console.log(res)
      if (res.data.acceso == true) {
        if (res.data.rol == "usuario"){
          const access_token = res.data.access_token;
          const id_paciente = res.data.id_paciente;
  
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("id_paciente", id_paciente);
          Vista.mostrarMensajeSatisfactorio("Inicio de sesión exitoso");
          Vista.redirigirAlUsuario();
        }

        if(res.data.rol == "medico"){
          const access_token = res.data.access_token;
          const nombreUsuario = res.data.nombre;
          const id_paciente = res.data.id_paciente;

          localStorage.setItem("access_token", access_token);
          localStorage.setItem("usuario", nombreUsuario);
          localStorage.setItem("id_paciente", id_paciente);

          Vista.redirigirMedico();
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