const Modelo = {

  // Funciones de recordatorios

  async agregarRecordatorio(fecha, hora, medicamento, informacion, id_paciente) {
    const datos_insertar = {
      fecha: fecha,
      hora: hora,
      medicamento: medicamento,
      informacion: informacion,
      id_paciente: id_paciente
    }

    console.log(datos_insertar)

    const res = await axios({
      method: "POST",
      url: `http://127.0.0.1:5000/crear-recordatorio/`,
      data: datos_insertar
    });
    return res;
  },

  async obtenerRecordatorios(id_paciente) {

    const res = await axios({
      method: "GET",
      url: `http://127.0.0.1:5000/obtener-recordatorio/${id_paciente}`,
    });
    return res;
  },

  // Muestra la lista de receordatorios de un paciente
  async mostrarRecordatoriosEliminar(id_paciente) {

    const datos_insertar = {
      id_paciente: id_paciente
    }

    const res = await axios({
      method: "POST",
      url: `http://127.0.0.1:5000/obtener-recordatorio/`,
      data: datos_insertar
    });
    return res;
  },

  async eliminarRecordatorio(idRecordatorioEliminar) {

    const res = await axios({
      method: "DELETE",
      url: `http://127.0.0.1:5000/eliminar-recordatorio/${idRecordatorioEliminar}`,
    });
    return res;
  },

  // Funciones de usuario

  async obtenerDatosUsuario(id_paciente) {

    const res = await axios({
      method: "GET",
      url: `http://127.0.0.1:5000/buscar-paciente/${id_paciente}`,
    });

    return res;
  },

}

const Vista = {

  // Funciones externas

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
    let diaActual = fechaActual.getDate();
    let fechaDia = fecha.substr(0, 2)

    if (diaActual == fechaDia) {
      return "Hoy"
    }
    else if (diaActual > fechaDia) {
      return "Ya pasó"

    } else {
      return "Mañana"

    }
  },

  //Funciones que traen datos

  getDatosIniciarSesion() {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    return { username, password };
  },

  getDatosUsuarioRecordatorios() {

    if (localStorage.getItem("id_paciente")) {
      const id_paciente = localStorage.getItem("id_paciente")
      return id_paciente
    }
  },

  getDatosUsuarioEliminarRecordatorios() {

    if (localStorage.getItem("id_paciente")) {
      const id_paciente = localStorage.getItem("id_paciente")
      return id_paciente
    }
  },

  getIdRecordatorioSeleccionadoEliminar() {
    const idRecordatorioEliminar = document.querySelector('#idRecordatorioEliminar').value;
    return { idRecordatorioEliminar };
  },

  getDatosRecordatorioAgregar() {
    const fecha = document.querySelector('#fechaInsertarRecordatorio').value;
    const hora = document.querySelector('#horaInsertarRecordatorio').value;
    const medicamento = document.querySelector('#campoMedicamentosCombobox').value;
    const informacion = document.querySelector('#informacionInsertarRecordatorio').value;

    if (localStorage.getItem("id_paciente")) {
      var id_paciente = localStorage.getItem("id_paciente")
    }

    return { fecha, hora, medicamento, informacion, id_paciente };
  },

  // Funciones que muestran la vista

  mostrarRecordatorios(response) {
    const contenedorRecordatorios = document.querySelector('#contenedorRecordatorios');
    data = response.data['recordatorios']
    data.forEach(element => {
      const contenedor = document.createElement('div');

      fechaFormateada = this.formatearFecha(element.fecha)
      tomarHoy = this.tomarhoy(fechaFormateada)
      contenedor.innerHTML =
        `
        <div class="datos-recordatorio">
          <div class="informacion-fecha">
              <p>${fechaFormateada}</p>
          </div>

          <div class="informacion-recordatorio">  
              <p>${element.informacion} ${element.medicamento}</p>
          </div>

          <div class="informacion-hora">
              <p>${element.hora}</p>
          </div>

          <div class="informacion-dia">
              <p>${tomarHoy}</p>
          </div>
        </div>      
      `
      contenedorRecordatorios.append(contenedor)
    });

  },

  mostrarInfoUsuario(response) {
    datosUsuario = response.data;
    nombreUsuario = datosUsuario['nombre']
    apellidoUsuario = datosUsuario['apellido']

    const infoUsuarioContenedor = document.getElementById('infoUsuarioContenedor');
    const parrafo = document.createElement('p');
    parrafo.textContent = "Bienvenido(a): " + nombreUsuario + " " + apellidoUsuario
    infoUsuarioContenedor.append(parrafo)
  },

  mostrarTickets: function (res) {
    datos = res.data['recordatorios']

    const tablaTickets = document.getElementById('tablaTickets');
    tablaTickets.innerHTML = ''; // Limpiar contenido existente

    // Crear la fila de encabezados
    const encabezadoRow = document.createElement('tr');
    for (const encabezado of Object.keys(datos[0])) {
      const th = document.createElement('th');
      th.textContent = encabezado;
      encabezadoRow.appendChild(th);
    }
    tablaTickets.appendChild(encabezadoRow);

    // Crear las filas de datos
    datos.forEach(dato => {
      const fila = document.createElement('tr');
      for (const prop in dato) {
        const celda = document.createElement('td');
        celda.textContent = dato[prop];
        fila.appendChild(celda);
      }
      tablaTickets.appendChild(fila);
    });

  },

  // Funciones de estatus

  mostrarMensajeError(mensaje) {
    Swal.fire({
      icon: 'error',
      title: 'Ocurrió un error',
      text: mensaje,
    })

  },

  mostrarMensajeSatisfactorio(mensaje) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: mensaje,
      showConfirmButton: false,
      timer: 800
    })

  },

  limpiarCampos() {
    username.value = "";
    password.value = "";
  },

  redirigirAIndex() {
    location.href = ("../index.html");
  },
}

const Controlador = {

  formatearFecha(fechaOriginal) {
    // Separa la fecha en año, mes y día
    var año = fechaOriginal.substr(0, 4);
    var mes = fechaOriginal.substr(4, 2);
    var dia = fechaOriginal.substr(6, 2);
    // Formatea la fecha en "dd / mm / aaaa"

    return dia + " / " + mes + " / " + año;
  },

  tomarhoy(fecha) {
    var fechaActual = new Date();
    let diaActual = fechaActual.getDate();
    let fechaDia = fecha.substr(0, 2)

    return fechaDia
  },

  async agregarRecordatorio() {
    const { fecha, hora, medicamento, informacion, id_paciente } = Vista.getDatosRecordatorioAgregar();
    // La fecha viene en formato yyyy-mm-dd, se eliminan los guiones medio.
    fechaFormateadaxd = fecha.replaceAll('-', '')
    try {

      const res = await Modelo.agregarRecordatorio(fechaFormateadaxd, hora, medicamento, informacion, id_paciente);
      statusRequest = res.request['status']
      if (statusRequest) {
        Vista.mostrarMensajeSatisfactorio("¡Recordatorio creado!")
      } else {
        Vista.mostrarMensajeError("No se pudo crear el recordatorio, intentalo nuevamente")
      }

    } catch (error) {
      console.log(error)
    }
  },

  async mostrarRecordatoriosCalendario() {

    const id_paciente = Vista.getDatosUsuarioRecordatorios();
    const res = await Modelo.obtenerRecordatorios(id_paciente);

    recordatorios = res.data['recordatorios']
    recordatoriosFecha = []
    recordatorios.forEach(element => {

      fecha = this.formatearFecha(element.fecha)
      fechaHoy = this.tomarhoy(fecha)
      recordatoriosFecha.push(fechaHoy)
    });

    const daysTag = document.querySelector(".days"),
      currentDate = document.querySelector(".current-date"),
      prevNextIcon = document.querySelectorAll(".icons span");
    // getting new date, current year and month
    let date = new Date(),
      currYear = date.getFullYear(),
      currMonth = date.getMonth();
    // storing full name of all months in array
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
      "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const renderCalendar = () => {
      let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
      let liTag = "";
      for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
      }

      for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
        // adding active class to li if the current day, month, and year matched
        let isToday = i === date.getDate() && currMonth === new Date().getMonth()
          && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
      }

      for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
      }
      currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
      daysTag.innerHTML = liTag;
    }
    renderCalendar();
    prevNextIcon.forEach(icon => { // getting prev and next icons
      icon.addEventListener("click", () => { // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
        if (currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
          // creating a new date of current year & month and pass it as date value
          date = new Date(currYear, currMonth, new Date().getDate());
          currYear = date.getFullYear(); // updating current year with new date year
          currMonth = date.getMonth(); // updating current month with new date month
        } else {
          date = new Date(); // pass the current date as date value
        }
        renderCalendar(); // calling renderCalendar function
      });
    });
  },

  async obtenerRecordatorios() {

    const id_paciente = Vista.getDatosUsuarioRecordatorios();

    try {
      const res = await Modelo.obtenerRecordatorios(id_paciente);
      Vista.mostrarRecordatorios(res)
    } catch (err) {
      console.log(err);
    }

  },

  async obtenerRecordatoriosEliminar() {

    const id_paciente = Vista.getDatosUsuarioRecordatorios();

    try {
      const res = await Modelo.obtenerRecordatorios(id_paciente);
      Vista.mostrarTickets(res)

    } catch (err) {
      console.log(err);
    }

  },

  async eliminarRecordatorioSeleccionado() {
    const { idRecordatorioEliminar } = Vista.getIdRecordatorioSeleccionadoEliminar()

    try {
      const res = Modelo.eliminarRecordatorio(idRecordatorioEliminar);

    } catch (err) {
      console.log(err)
    }
  },
  /*
    async infoUsuario() {
  
      const id_paciente = Vista.getDatosUsuarioRecordatorios();
  
      try {
        const res = await Modelo.obtenerDatosUsuario(id_paciente);
        Vista.mostrarInfoUsuario(res)
      } catch (err) {
        console.log(err);
      }
    }
    */
}

document.addEventListener('DOMContentLoaded', function () {

  Controlador.obtenerRecordatorios();
  Controlador.mostrarRecordatoriosCalendario();

  //botonAgregarRecordatorio()


  /* MODAL ELIMINAR RECORDATORIO */
  var modalEliminarRecordatorio = document.getElementById("targetModalEliminarRecordatorio");
  var btnAbrirModalEliminarRecordatorio = document.getElementById("btnAbrirModalEliminarRecordatorio");
  var btnCerrarModalEliminarRecordatorio = document.getElementsByClassName("cerrar-modal-eliminar-recordatorio")[0];

  btnAbrirModalEliminarRecordatorio.onclick = function () {
    modalEliminarRecordatorio.style.display = "block";
    Controlador.obtenerRecordatoriosEliminar();
  }

  btnCerrarModalEliminarRecordatorio.onclick = function () {
    modalEliminarRecordatorio.style.display = "none";
  }

  window.onclick = function (event) {
    if (event.target == modalEliminarRecordatorio) {
      modalEliminarRecordatorio.style.display = "none";
    }
  }


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

  /* MODAL Notificaciones */
  var modalNotificaciones = document.getElementById("targetModalNotificaciones");
  var btnAbrirModalNotificaciones = document.getElementById("btnAbrirModalNotificaciones");
  var btnCerrarModalNotificaciones = document.getElementsByClassName("cerrar-modal-notificaciones")[0];

  btnAbrirModalNotificaciones.onclick = function () {
    modalNotificaciones.style.display = "block";
  }

  btnCerrarModalNotificaciones.onclick = function () {
    modalNotificaciones.style.display = "none";
  }

  window.onclick = function (event) {
    if (event.target == modalNotificaciones) {
      modalNotificaciones.style.display = "none";
    }
  }

  //localStorage

  if (localStorage.getItem("access_token")) {

    const menuDerecha = document.getElementById('menuDerecha');
    const div = document.createElement('div')
    div.classList.add('cerrar-sesion')
    div.innerHTML =
      `
      <a id = "cerrarSesion"><i class="fa-solid fa-right-from-bracket fa-2x"></i></a>
    `
    menuDerecha.append(div)
  }else{
    const menuDerecha = document.getElementById('menuDerecha');
    const div = document.createElement('div')
    div.classList.add('iniciar-sesion')
    div.innerHTML =
      `
      <a id = "IniciarSesion" href = "./pages/login.html"><i class="fa-solid fa-right-from-bracket fa-2x"></i></a>
    `
    menuDerecha.append(div)
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
        localStorage.removeItem('id_paciente');
        localStorage.removeItem('id_patient');
        location.href = ("./pages/login.html");
      }
    })

  }

});


const botonEliminarRecordatorioSeleccionado = document.querySelector("#buscarButton");

botonEliminarRecordatorioSeleccionado.onclick = function () {

  if (Controlador.eliminarRecordatorioSeleccionado()) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: "Eliminado",
      showConfirmButton: false,
      timer: 800
    })
    Controlador.obtenerRecordatoriosEliminar();
    Controlador.mostrarRecordatoriosCalendario();
  }
}

const btnInsertarDatosRecordatorio = document.querySelector('#btnInsertarDatosRecordatorio');

btnInsertarDatosRecordatorio.onclick = function () {
  Controlador.agregarRecordatorio()
}