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
    
  },

  async mostrarRecordatoriosCalendario() {

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
  }
}

document.addEventListener('DOMContentLoaded', function () {

  Controlador.obtenerRecordatorios();
  Controlador.mostrarRecordatoriosCalendario();
  
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
        localStorage.removeItem('id_patient');
        location.reload();
      }
    })


  }


})