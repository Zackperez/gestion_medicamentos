const Modelo = {
    async obtenerDatosPaciente(id_paciente) {

        const res = await axios({
            method: "GET",
            url: `http://127.0.0.1:5000/obtener-datos-usuario/${id_paciente}`,
        });
        return res;
    },

    async obtenerNotificaciones(id) {
        const res = await axios({
          method: "GET",
          url: `http://127.0.0.1:5000/obtener-notificaciones/${id}`,
        });
        return res;
      },
}

const Vista = {
    getUsuario() {

        if (localStorage.getItem("id_paciente")) {
            const id_paciente = localStorage.getItem("id_paciente")
            return id_paciente
        }
    },

    getDatosUsuarioRecordatorios() {

        if (localStorage.getItem("id_paciente")) {
          const id_paciente = localStorage.getItem("id_paciente")
          return id_paciente
        }
      },

    mostrarDatosUsuario(res) {
        datos = res.data
        datos_usuario = datos['datos_usuario']
        nombre = datos_usuario['nombre']
        apellido = datos_usuario['apellido']
        correo = datos_usuario['correo']
        direccion = datos_usuario['direccion']
        sexo = datos_usuario['sexo']
        cedula = datos_usuario['id_paciente']
        fecha = datos_usuario['fecha']
        celular = datos_usuario['celular']


        const informacionPerfil = document.getElementById('informacionPerfil')
        informacionPerfil.innerHTML =
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

    mostrarNotificaciones(res) {

        const contenedorNotificaciones = document.getElementById('contenedorNotificaciones');
        const notificacionNumero = document.getElementById('notificacionNumero');
        numeroNotificaciones = res.data['datos_notificaciones'].length
        dataxd = res.data['datos_notificaciones']
        dataxd.forEach(element => {
          const div = document.createElement('div');
          div.classList.add('contenedor-notificaciones');
          div.innerHTML =
              `
            <div class="icono">
                <i class="fa-solid fa-prescription-bottle-medical fa-3x"></i>
            </div>
    
            <div class="titulo">
                <p>Retiro de ${element.medicina}</p>
            </div>
    
            <div class="fecha">
                <p><i class="fa-regular fa-calendar-days"></i> Dia: ${element.fecha}</p>
            </div>
    
            <div class="hora">
                <p><i class="fa-solid fa-clock"></i> Hora: ${element.hora}</p>
            </div>
    
            <div class="lugar">
                <p>Lugar:${element.informacion}</p>
            </div>
            `
          contenedorNotificaciones.append(div)
        });
        const div = document.createElement('div');
        div.classList.add('notificacion-numero')
        div.innerHTML = 
        `
          <p>${numeroNotificaciones}</p>
    
        `;
        notificacionNumero.append(div)
    
      },

}

const Controlador = {

    async obtenerDatosPaciente() {

        const id_paciente = Vista.getUsuario();

        try {
            const res = await Modelo.obtenerDatosPaciente(id_paciente);
            Vista.mostrarDatosUsuario(res)
        } catch (err) {
            console.log(err);
        }

    },

    async mostrarNotificaciones() {
        const id_paciente = Vista.getDatosUsuarioRecordatorios();
    
        try {
          const res = await Modelo.obtenerNotificaciones(id_paciente);
          Vista.mostrarNotificaciones(res)
        } catch (err) {
          console.log(err);
        }
      }


}

document.addEventListener('DOMContentLoaded', function () {

    Controlador.obtenerDatosPaciente()
    Controlador.mostrarNotificaciones()

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
                location.href = ("./pages/login.html");
            }
        })

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

});

