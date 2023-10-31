const Modelo = {
    async obtenerDatosPaciente(id_paciente) {

        const res = await axios({
            method: "GET",
            url: `http://127.0.0.1:5000/obtener-datos-usuario/${id_paciente}`,
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

    mostrarDatosUsuario(res){
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
    }
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
}

document.addEventListener('DOMContentLoaded', function () {

    Controlador.obtenerDatosPaciente()

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
        //<i class="fa-solid fa-right-from-bracket"></i>
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
                localStorage.removeItem('id_paciente');
                location.reload();
            }
        })

    }

});