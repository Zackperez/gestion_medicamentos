const Modelo = {

  async obtenerDatosUsuario(idUsuario) {

    const res = await axios({
      method: "GET",
      url: `http://127.0.0.1:5000/obtener-reportes-paciente/${idUsuario}`,
    });
    return res;
  },

  async enviarNotificacion(fecha, hora, medicina, informacion, asunto, id_paciente, celular){
    const datos_insertar = {
      fecha: fecha,
      hora: hora,
      medicina: "Retiro de "+medicina,
      informacion: informacion,
      asunto: asunto,
      celular: celular,
      id_paciente: id_paciente,
    }

    console.log(datos_insertar)

    const res = await axios({
      method: "POST",
      url: `http://127.0.0.1:5000/enviar-notificaciones-usuario/`,
      data: datos_insertar
    });
    return res;
  }

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
    celular = datos_usuario['celular']
    idPaciente = datos_usuario['id_paciente']

    correo = datos_usuario['correo']
    const contenedorCorreo = document.getElementById('contenedorCorreo');

    contenedorCorreo.innerHTML =
      `
      <div class="campo destinario">
        <div class="titulo">
            <p>Correo:</p>
        </div>
        <div class="texto">
            <input type="email" value="${correo}" id = "correoUsuario"> 
        </div>
      </div>

      <div class="campo celular">
        <div class="titulo">
            <p>Celular:</p>
        </div>

        <div class="texto">
            <input type="phone" id = "celularEscrito" value = "${celular}">
        </div>
      </div>

      <div class="campo asunto">
        <div class="titulo">
            <p>Asunto:</p>
        </div>
        <div class="texto">
            <input type="text" value="" id = "asuntoEscrito">
        </div>
      </div>
      
      <div class="campo medicamento">
        <div class="titulo">
            <p>Medicamento:</p>
        </div>
        <div class="texto">
            <input type="text" value="" id = "medicamentoEscrito">
        </div>
      </div>

    <div class="campo fecha">
      <div class="titulo">
          <p>Fecha:</p>
      </div>
      <div class="texto">
          <input type="date" id = "fechaSeleccionada">
      </div>
    </div>

    <div class="campo hora">
      <div class="titulo">
          <p>Hora:</p>
      </div>
      <div class="texto">
          <input type="time" id = "horaSeleccionada">
      </div>
    </div>
  
    <div class="campo descripcion-correo">
        <div class="titulo">
            <p>Descripcion:</p>
        </div>
        <div class="texto">
            <textarea id="correoDescripcion"></textarea>
        </div>
    </div>

    <div class="botones">
      <button id="enviarCorreo">Enviar</button>
  </div>
      `

      const enviarCorreo = document.getElementById('enviarCorreo')

      enviarCorreo.addEventListener("click", function() {
        Controlador.enviarNotificacion(idPaciente);
      })
  },

  datosNotificacion(){
    const fecha = document.getElementById('fechaSeleccionada').value
    const hora = document.getElementById('horaSeleccionada').value
    const medicina = document.getElementById('medicamentoEscrito').value
    const informacion = document.getElementById('correoDescripcion').value
    const asunto = document.getElementById('asuntoEscrito').value
    const celular = document.getElementById('celularEscrito').value
    const idPaciente = document.getElementById('idPaciente').value

    return { fecha, hora, medicina, informacion, asunto, idPaciente, celular } 
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

  borrarCamposCorreo() {
    var asuntoEscrito = document.querySelector('#asuntoEscrito');
    var medicamentoEscrito = document.querySelector('#medicamentoEscrito');
    var correoDescripcion = document.querySelector('#correoDescripcion');
    asuntoEscrito.value = "";
    medicamentoEscrito.value = "";
    correoDescripcion.value = "";

  }
}

const Controlador = {

  async traerInformacionUsuario() {
    const { idPaciente } = Vista.traerIdUsuario()

    try {
      const res = await Modelo.obtenerDatosUsuario(idPaciente)
      Vista.mostrarDatosUsuario(res)
      Vista.mostrarEnviarCorreo(res)
      Vista.datosNotificacion(res)

    } catch (error) {
      console.log(error)
      Vista.mostrarMensajeError(`El ID ${idPaciente} no existe`)

    }
  },

  async enviarNotificacion(idPaciente) {
    const { fecha, hora, medicina, informacion, asunto, celular } = Vista.datosNotificacion()

    try {
      await Modelo.enviarNotificacion(fecha, hora, medicina, informacion, asunto, idPaciente, celular)
      Vista.mostrarMensajeSatisfactorio("Notificación enviada")
      Vista.borrarCamposCorreo()
    } catch (error) {
      console.log(error)
      Vista.mostrarMensajeError(`El ID ${idPaciente} no existe`)

    }
  }
}

document.addEventListener('DOMContentLoaded', function () {

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
        <a id = "IniciarSesion" href = "./login.html"><i class="fa-solid fa-right-from-bracket fa-2x"></i></a>
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

});

const buscarPaciente = document.getElementById('buscarPaciente')

buscarPaciente.onclick = function () {
  Controlador.traerInformacionUsuario()
}


