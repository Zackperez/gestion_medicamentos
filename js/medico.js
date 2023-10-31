const Modelo = {

  async obtenerDatosUsuario(idUsuario) {

    const res = await axios({
      method: "GET",
      url: `http://127.0.0.1:5000/obtener-reportes-paciente/${idUsuario}`,
    });
    return res;
  },

}

const Vista = {

  traerIdUsuario() {
    const idPaciente = document.getElementById('idPaciente').value;
    return { idPaciente }
  },

  /*
    mostrarRecordatoriosUsuario(res) {
      datos_recordatorios = res.data.recordatorios_medicamentos
      console.log(datos_recordatorios)
      const recordatoriosContenedor = document.getElementById('recordatoriosContenedor')
      datos_recordatorios.forEach(element => {
        const contenedor = document.createElement('div');
        contenedor.classList.add('recordatorio')
  
        contenedor.innerHTML = `
          <div class="icono">
              <i class="fa-solid fa-clock fa-2x"></i>
          </div>
  
          <div class="medicamento">
            <p>${element.medicamento}</p>
          </div>
  
          <div class="descripcion">
              <p>${element.informacion}</p>
          </div>
  
          <div class="fecha">
              <p><i class="fa-regular fa-calendar-days"></i>Fecha: ${element.fecha}</p>
          </div>
  
          <div class="hora">
              <p><i class="fa-solid fa-clock"></i> Hora: ${element.hora}</p>
          </div>
        `
        recordatoriosContenedor.append(contenedor)
      });
    },
  */

  mostrarRecordatoriosUsuario(res) {
    datos = res.data.recordatorios_medicamentos

    const tablaRecordatorios = document.getElementById('tablaRecordatorios');
    tablaRecordatorios.innerHTML = ''; // Limpiar contenido existente

    // Crear la fila de encabezados
    const encabezadoRow = document.createElement('tr');
    for (const encabezado of Object.keys(datos[0])) {
      const th = document.createElement('th');
      th.textContent = encabezado;
      encabezadoRow.appendChild(th);
    }
    tablaRecordatorios.appendChild(encabezadoRow);

    // Crear las filas de datos
    datos.forEach(dato => {
      const fila = document.createElement('tr');
      for (const prop in dato) {
        const celda = document.createElement('td');
        celda.textContent = dato[prop];
        fila.appendChild(celda);
      }
      tablaRecordatorios.appendChild(fila);
    });

  },

  mostrarReportes: function (res) {
    datos = res.data.reportes

    const tablaReportes = document.getElementById('tablaReportes');
    tablaReportes.innerHTML = ''; // Limpiar contenido existente

    // Crear la fila de encabezados
    const encabezadoRow = document.createElement('tr');
    for (const encabezado of Object.keys(datos[0])) {
      const th = document.createElement('th');
      th.textContent = encabezado;
      encabezadoRow.appendChild(th);
    }
    tablaReportes.appendChild(encabezadoRow);

    // Crear las filas de datos
    datos.forEach(dato => {
      const fila = document.createElement('tr');
      for (const prop in dato) {
        const celda = document.createElement('td');
        celda.textContent = dato[prop];
        fila.appendChild(celda);
      }
      tablaReportes.appendChild(fila);
    });

  },

  mostrarDatosUsuario(res) {
    datos_usuario = res.data.datos_pacientes
    console.log(datos_usuario)

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
  }
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
    }
  }

}

document.addEventListener('DOMContentLoaded', function () {


})

const buscarPaciente = document.getElementById('buscarPaciente')

buscarPaciente.onclick = function () {
  Controlador.traerInformacionUsuario()
}