const Modelo = {

  async obtenerDatosUsuario(idUsuario) {

    const res = await axios({
      method: "GET",
      url: `http://127.0.0.1:5000/obtener-reportes-paciente/${idUsuario}`,
    });
    return res;
  },

  async traerDatosDoctor(idDoctor) {
    const res = await axios({
      method: "GET",
      url: `http://127.0.0.1:5000/datos-doctor/${idDoctor}`,
    });
    return res;
  },
}

const Vista = {

  formatearFecha(fechaOriginal) {
    // Separa la fecha en año, mes y día
    var año = fechaOriginal.substr(0, 4);
    var mes = fechaOriginal.substr(4, 2);
    var día = fechaOriginal.substr(6, 2);
    // Formatea la fecha en "dd / mm / aaaa"
    return día + " / " + mes + " / " + año;
  },

  traerIdUsuario() {
    const idPaciente = document.getElementById('idPaciente').value;
    return { idPaciente }
  },

  mostrarRecordatoriosUsuario(res) {
    datos = res.data.recordatorios_medicamentos

    const tablaRecordatorios = document.getElementById('tablaRecordatorios');
    tablaRecordatorios.innerHTML = ''; // Limpiar contenido existente

    const datosFormateados = datos.map(item => ({
      ...item,
      fecha: this.formatearFecha(item.fecha),
    }));

    const columnas = ['fecha', 'hora','id_recordatorio', 'informacion', 'medicamento'];


    // Crear la fila de encabezados
    const encabezadoRow = document.createElement('tr');
    for (const encabezado of columnas) {
      const th = document.createElement('th');
      th.textContent = encabezado;
      encabezadoRow.appendChild(th);
    }
    tablaRecordatorios.appendChild(encabezadoRow);

    // Crear las filas de datos
    datosFormateados.forEach(dato => {
      const fila = document.createElement('tr');
      for (const columna of columnas) {
        const celda = document.createElement('td');
        celda.textContent = dato[columna];
        fila.appendChild(celda);
      }
      tablaRecordatorios.appendChild(fila);
    });

  },

  mostrarReportes: function (res) {
    datos = res.data.reportes

    let otro = datos;
    const otros = otro.map(item => {
      const { created_at, ...rest } = item;
      const fechaFormateada = created_at.split('T')[0].split('-').reverse().join(' / ');
      return { ...rest, creado: fechaFormateada };
    });
    

    const tablaReportes = document.getElementById('tablaReportes');
    tablaReportes.innerHTML = ''; // Limpiar contenido existente
    // Crear la fila de encabezados en el nuevo orden deseado
    const columnas = ['creado', 'id_reportes', 'enfermedad', 'descripcion',];

    const encabezadoRow = document.createElement('tr');
    for (const columna of columnas) {
      const th = document.createElement('th');
      th.textContent = columna;
      encabezadoRow.appendChild(th);
    }
    tablaReportes.appendChild(encabezadoRow);

    otros.forEach(dato => {
      const fila = document.createElement('tr');
      for (const columna of columnas) {
        const celda = document.createElement('td');
        celda.textContent = dato[columna];
        fila.appendChild(celda);
      }
      tablaReportes.appendChild(fila);
    });

  },


  mostrarDatosUsuario(res) {
    datos_usuario = res.data.datos_pacientes

    nombre = datos_usuario['nombre']
    apellido = datos_usuario['apellido']
    direccion = datos_usuario['direccion']
    sexo = datos_usuario['sexo']
    cedula = datos_usuario['id_paciente']
    fecha = datos_usuario['fecha']
    celular = datos_usuario['celular']
    correo = datos_usuario['correo']


    const datosUsuarioContenedor = document.getElementById('datosUsuarioContenedor');
    datosUsuarioContenedor.innerHTML =
      `
      <div class="campo">
        <div class="titulo">
            <p>Cédula:</p>
        </div>
        <div class="texto nombre">
            <p>${cedula}</p>
        </div>
    </div>

    <div class="campo">
        <div class="titulo">
            <p>Nombres:</p>
        </div>
        <div class="texto nombre">
            <p>${nombre}</p>
        </div>
    </div>

    <div class="campo">
        <div class="titulo">
            <p>Apellidos:</p>
        </div>
        <div class="texto apellido">
            <p>${apellido}</p>
        </div>
    </div>

    <div class="campo">
        <div class="titulo">
            <p>Correo:</p>
        </div>
        <div class="texto correo">
            <p>${correo}</p>
        </div>
    </div>

    <div class="campo">
        <div class="titulo">
            <p>Celular:</p>
        </div>
        <div class="texto celular">
            <p>${celular}</p>
        </div>
    </div>

    <div class="campo">
        <div class="titulo">
            <p>Sexo:</p>
        </div>
        <div class="texto sexo">
            <p>${sexo}</p>
        </div>
    </div>

    <div class="campo">
        <div class="titulo">
            <p>Fecha de nacimiento:</p>
        </div>
        <div class="texto fecha">
            <p>${fecha}</p>
        </div>
    </div>

    <div class="campo">
        <div class="titulo">
            <p>Dirección:</p>
        </div>
        <div class="texto direccion">
            <p>${direccion}</p>
        </div>
    </div>
      `

  },

  mostrarEnviarCorreo(res) {
    datos_usuario = res.data.datos_pacientes
    correo = datos_usuario['correo']
    const contenedorCorreo = document.getElementById('contenedorCorreo');

    contenedorCorreo.innerHTML =
      `
    <div class="campo destinario">
      <div class="titulo">
          <p>Correo:</p>
      </div>
      <div class="texto">
          <input type="email" value="${correo}"> 
      </div>
  </div>

  <div class="campo asunto">
      <div class="titulo">
          <p>Asunto:</p>
      </div>
      <div class="texto">
          <input type="text" value="Busqueda de medicamentos">
      </div>
  </div>

  <div class="campo texto-correo">
      <div class="titulo">
          <p>Texto:</p>
      </div>
      <div class="texto">
          <textarea id="correoTexto"></textarea>
      </div>
  </div>

  <div class="botones">
      <button id="enviarCorreo">Enviar</button>
  </div>
    `
  },

  traerNombreDoctor() {
    const idDoctor = localStorage.getItem('id_paciente');
    return idDoctor
  },

  mostrarDatosDoctor(res) {
    datos_doctor = res.data

    const nombreUsuario = datos_doctor.nombre;
    const menuNombreUsuario = document.getElementById('menuNombreUsuario');
    const p = document.createElement('p');
    const pTexto = document.createTextNode(`Dr. ${nombreUsuario}`);
    p.appendChild(pTexto);
    menuNombreUsuario.appendChild(p)

  },

  mostrarMensajeSatisfactorio(mensaje) {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: mensaje,
    })
  },

  mostrarMensajeError(mensaje) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: mensaje,
    })
  },
}

const Controlador = {

  async traerInformacionUsuario() {
    const { idPaciente } = Vista.traerIdUsuario()

    try {
      const res = await Modelo.obtenerDatosUsuario(idPaciente)

      Vista.mostrarDatosUsuario(res)
      Vista.mostrarRecordatoriosUsuario(res)
      Vista.mostrarReportes(res)
      Vista.mostrarEnviarCorreo(res)

    } catch (error) {
      console.log(error)
      Vista.mostrarMensajeError(`El ID ${idPaciente} no existe`)

    }
  },

  async traerDatosDoctor() {
    const idDoctor = Vista.traerNombreDoctor()
    try {
      const res = await Modelo.traerDatosDoctor(idDoctor)
      Vista.mostrarDatosDoctor(res)
    } catch (error) {
      console.log(error)
    }
  }

}

document.addEventListener('DOMContentLoaded', function () {

  Controlador.traerDatosDoctor();


  if (localStorage.getItem("access_token")) {

    const menuDerecha = document.getElementById('menuDerecha');
    const div = document.createElement('div')
    div.classList.add('cerrar-sesion')
    div.innerHTML =
      `
      <a id = "cerrarSesion"><i class="fa-solid fa-right-from-bracket fa-2x"></i></a>
    `
    menuDerecha.append(div)
  } else {
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
        location.href = ("./login.html");
      }
    })

  }

})

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

const buscarPaciente = document.getElementById('buscarPaciente')

buscarPaciente.onclick = function () {
  Controlador.traerInformacionUsuario()
}