const Modelo = {

  async iniciarSesion(username, password) {

    const datos_insertar = {
      usuario: username,
      contrasena: password
    }

    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:5000/login",
      data: datos_insertar
    });
    return res;
  },

  async obtenerRecordatorios(id_patient) {

    const datos_insertar = {
      id_patient: id_patient
    }

    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:5000/obtener_recordatorio/",
      data: datos_insertar
    });
    return res;
  }
}

const Vista = {
  getDatosIniciarSesion() {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    return { username, password };
  },

  getDatosUsuarioRecordatorios() {

    if (localStorage.getItem("id_patient")) {
      const id_patient = localStorage.getItem("id_patient")
      return id_patient
    }
  },

  mostrarMensajeError(mensaje) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: mensaje,
    })

  },

  formatearFecha(fechaOriginal) {
    // Separa la fecha en año, mes y día
    var año = fechaOriginal.substr(0, 4);
    var mes = fechaOriginal.substr(4, 2);
    var día = fechaOriginal.substr(6, 2);
    // Formatea la fecha en "dd / mm / aaaa"
    return día + " / " + mes + " / " + año;
  },

  tomarhoy(fecha) {
    var fechaActual = new Date();
    let dia = fechaActual.getDate();
    let fechaDia = fecha.substr(0, 2)

    if (fechaDia == dia) {
      return "Hoy"
    }
    if (fechaDia == dia + 1) {
      return "Mañana"
    }

    if (fechaDia == dia + 2) {
      return "Pasado mañana"

    } else {

      return "Otro dia"
    }
  },

  mostrarRecordatorios(response) {
    const contenedorRecordatorios = document.getElementById('contenedorRecordatorios');
    data = response.data['recordatorios']
    console.log(data)
    data.forEach(element => {
      const contenedor = document.createElement('div');

      fechaFormateada = this.formatearFecha(element.date)
      tomarHoy = this.tomarhoy(fechaFormateada)
      contenedor.innerHTML =
        `
        <div class="contenedor">
          <div class="informacion-fecha">
              <p>${fechaFormateada}</p>
          </div>

          <div class="informacion-recordatorio">  
              <p>${element.information} ${element.medicine}</p>
          </div>

          <div class="informacion-hora">
              <p>${element.time}</p>
          </div>

          <div class="informacion-dia">
              <p>${tomarHoy}</p>
          </div>
        </div>      
      `
      contenedorRecordatorios.append(contenedor)
    });

  },

  mostrarMensajeSatisfactorio(mensaje) {
    console.log(mensaje);
  },

  limpiarCampos() {
    username.value = "";
    password.value = "";
  },

  redirigirAIndex() {
    location.href = ("../index.html");
  }
}

const Controlador = {

  async iniciarSesion() {
    const { username, password } = Vista.getDatosIniciarSesion();
    try {
      const res = await Modelo.iniciarSesion(username, password);
      if (res.data.acceso == "AUTORIZADO") {
        const access_token = res.data.access_token;
        localStorage.setItem("access_token", access_token);
        Vista.mostrarMensajeSatisfactorio("Inicio de sesión exitoso");
        Vista.redirigirAIndex();
      } else {
        Vista.mostrarMensajeError("Usuario no encontrado")
        Vista.limpiarCampos();
      }

    } catch (err) {
      Vista.mostrarMensajeError('Error al iniciar sesión');
      console.log(err);

      Vista.limpiarCampos();
    }
  },

  async obtenerRecordatorios() {

    const id_patient = Vista.getDatosUsuarioRecordatorios();

    try {
      const res = await Modelo.obtenerRecordatorios(id_patient);
      Vista.mostrarRecordatorios(res)

    } catch (err) {
      console.log(err);

    }
  }
}


document.addEventListener('DOMContentLoaded', function () {

  Controlador.obtenerRecordatorios()

  /* MODAL Eliminar */
  var modalEliminar = document.getElementById("targetModalInsertar");
  var btnAbrirModalEliminar = document.getElementById("btnAbrirModalInsertar");
  var btnCerrarModalEliminar = document.getElementsByClassName("cerrar-modal-insertar")[0];

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

  /* MODAL Reportar */
  var modalReportar = document.getElementById("targetModalReportar");
  var btnAbrirModalReportar = document.getElementById("btnAbrirModalReportar");
  var btnCerrarModalReportar = document.getElementsByClassName("cerrar-modal-reportar")[0];

  btnAbrirModalReportar.onclick = function () {
    modalReportar.style.display = "block";
  }

  btnCerrarModalReportar.onclick = function () {
    modalReportar.style.display = "none";
  }

  window.onclick = function (event) {
    if (event.target == modalReportar) {
      modalReportar.style.display = "none";
    }
  }


  //localStorage

  if (localStorage.getItem("access_token")) {

    const ul = document.getElementById("menuLista");
    const li = document.createElement('li');
    const button = document.createElement('button');
    const a = document.createElement('a');
    li.classList.add('menu__item');
    button.setAttribute("id", "cerrarSesion")
    button.appendChild(a)
    li.appendChild(button)
    a.appendChild(document.createTextNode("Cerrar sesión"));
    ul.appendChild(li);

  } else {
    const ul = document.getElementById("menuLista");
    const li = document.createElement('li');
    const button = document.createElement('button');
    const a = document.createElement('a');
    li.classList.add('menu__item');
    button.setAttribute("id", "IniciarSesion")
    a.setAttribute("href", "./pages/login.html");
    button.appendChild(a)
    li.appendChild(button)
    a.appendChild(document.createTextNode("Iniciar Sesión"));
    ul.appendChild(li);
  }

  const cerrarSesion = document.getElementById("cerrarSesion");

  cerrarSesion.onclick = function () {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Cerrar sesión',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('access_token');
        location.href = "../index.html";
      }
    })


  }


})