
// ─────────────────────────────────────────────────────────
// CONFIGURACIÓN
// ─────────────────────────────────────────────────────────

// Ruta base de nuestra API (los archivos PHP)
var API = 'catalogo-servicios/api';

// Variable para saber si estamos editando (guarda el ID)
// null = estamos creando uno nuevo
var idEnEdicion = null;


// 1. CARGAR Y MOSTRAR SERVICIOS

function cargarServicios(categoria) {
  /*
    Esta función:
    1. Construye la URL con o sin filtro de categoría
    2. Le pide los datos al servidor con fetch()
    3. Llama a mostrarServicios() con los datos recibidos
  */

  // Construimos la URL dependiendo si hay filtro o no
  var url;
  if (categoria) {
    // Con filtro: listar.php?categoria=fotografia
    url = API + '/listar.php?categoria=' + categoria;
  } else {
    // Sin filtro: listar.php (trae todos)
    url = API + '/listar.php';
  }

  // Mientras carga, mostramos un mensaje
  document.getElementById('contenedor-servicios').innerHTML =
    '<div class="col-12 text-center py-5"><p class="text-muted">Cargando servicios...</p></div>';

  // fetch() hace la petición al servidor
  // .then() = "cuando llegue la respuesta, haz esto"
  fetch(url)
    .then(function(respuesta) {
      // La respuesta llega como texto, la convertimos a JSON
      return respuesta.json();
    })
    .then(function(servicios) {
      // Ahora "servicios" es un arreglo con los datos
      // Lo guardamos para poder buscarlo después
      window.todosLosServicios = servicios;
      mostrarServicios(servicios);
    })
    .catch(function(error) {
      // Si algo falla (ej: el servidor PHP no está corriendo)
      document.getElementById('contenedor-servicios').innerHTML =
        '<div class="col-12"><div class="alert alert-danger">' +
        'Error: no se pudo conectar con el servidor. ¿Está corriendo PHP?' +
        '</div></div>';
    });
}

function mostrarServicios(lista) {
  /*
    Esta función recibe un arreglo de servicios
    y los convierte en tarjetas HTML dentro de la página.
    Esto se llama "manipulación del DOM".
  */

  // Obtenemos el elemento HTML donde vamos a poner las tarjetas
  var contenedor = document.getElementById('contenedor-servicios');

  // Si no hay servicios, mostramos un mensaje
  if (lista.length === 0) {
    contenedor.innerHTML = '<div class="col-12 text-center py-5 text-muted">No hay servicios en esta categoría.</div>';
    return; // Salimos de la función aquí
  }

  // Empezamos con HTML vacío
  var html = '';

  // Recorremos cada servicio del arreglo
  for (var i = 0; i < lista.length; i++) {
    var s = lista[i]; // s = servicio actual

    // Elegimos el ícono según la categoría
    var icono = '✨'; // ícono por defecto
    if (s.categoria === 'fotografia') icono = '📸';
    if (s.categoria === 'video360')   icono = '🎥';
    if (s.categoria === 'bar')        icono = '🎉';
    if (s.categoria === 'decoracion') icono = '🎞️';

    // Precio formateado (o texto si no tiene precio)
    var precioTexto;
    if (s.precio) {
      precioTexto = '$' + Number(s.precio).toLocaleString('es-MX') + ' MXN';
    } else {
      precioTexto = 'Precio a consultar';
    }

    // Construimos el HTML de la tarjeta
    // Nota: onclick llama a las funciones de editar y eliminar
    html += '<div class="col-sm-6 col-lg-4 mb-4">';
    html += '  <div class="card h-100 tarjeta-servicio">';
    html += '    <div class="card-body d-flex flex-column">';
    html += '      <div class="fs-2 mb-2">' + icono + '</div>';
    html += '      <h5 class="card-title">' + s.nombre + '</h5>';
    html += '      <p class="card-text text-muted flex-grow-1">' + (s.descripcion || '') + '</p>';
    html += '      <div class="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">';
    html += '        <strong class="text-success">' + precioTexto + '</strong>';
    html += '        <div>';
    html += '          <button class="btn btn-sm btn-outline-secondary me-1" onclick="abrirEdicion(' + s.id + ')">✏️ Editar</button>';
    html += '          <button class="btn btn-sm btn-outline-danger" onclick="eliminarServicio(' + s.id + ', \'' + s.nombre + '\')">🗑️</button>';
    html += '        </div>';
    html += '      </div>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';
  }

  // Ponemos todo el HTML generado en el contenedor
  contenedor.innerHTML = html;
}

// 2. FILTRAR POR CATEGORÍA

function filtrar(categoria, botonPresionado) {
  /*
    Cuando el usuario hace clic en un filtro:
    1. Quitamos la clase "activo" de todos los botones
    2. Se la ponemos al botón que presionaron
    3. Cargamos los servicios de esa categoría
  */

  // Quitamos .activo de todos los botones de filtro
  var botones = document.querySelectorAll('.btn-filtro');
  for (var i = 0; i < botones.length; i++) {
    botones[i].classList.remove('activo');
  }

  // Le ponemos .activo al botón que presionaron
  botonPresionado.classList.add('activo');

  // Cargamos los servicios con ese filtro
  cargarServicios(categoria);
}

// 3. BUSCAR (filtra localmente sin ir al servidor)

function buscar(textoBusqueda) {
  /*
    Filtra los servicios que ya están en memoria
    (window.todosLosServicios) sin hacer otra petición al servidor.
    Más rápido que ir al servidor cada vez.
  */
  var texto = textoBusqueda.toLowerCase();

  if (texto === '') {
    // Si borró todo el texto, mostramos todos
    mostrarServicios(window.todosLosServicios);
    return;
  }

  // Filtramos los que incluyan el texto en nombre o descripción
  var resultados = [];
  for (var i = 0; i < window.todosLosServicios.length; i++) {
    var s = window.todosLosServicios[i];
    var enNombre      = s.nombre.toLowerCase().includes(texto);
    var enDescripcion = (s.descripcion || '').toLowerCase().includes(texto);
    if (enNombre || enDescripcion) {
      resultados.push(s);
    }
  }

  mostrarServicios(resultados);
}

// 4. ABRIR MODAL (crear o editar)

function abrirModalNuevo() {
  /*
    Abre el modal en modo "crear":
    - Limpia los campos
    - Pone el título "Nuevo servicio"
    - Guarda que no estamos editando (idEnEdicion = null)
  */
  idEnEdicion = null;

  // Limpiamos los campos del formulario
  document.getElementById('campo-nombre').value      = '';
  document.getElementById('campo-descripcion').value = '';
  document.getElementById('campo-categoria').value   = '';
  document.getElementById('campo-precio').value      = '';
  document.getElementById('error-formulario').innerHTML = '';

  // Cambiamos el título del modal
  document.getElementById('titulo-modal').textContent = 'Nuevo servicio';

  // Abrimos el modal usando Bootstrap
  var modal = new bootstrap.Modal(document.getElementById('modalServicio'));
  modal.show();
}

function abrirEdicion(id) {
  /*
    Abre el modal en modo "editar":
    - Busca el servicio en el arreglo guardado
    - Llena los campos con sus datos actuales
  */
  idEnEdicion = id; // Guardamos el ID para saber que estamos editando

  // Buscamos el servicio en el arreglo que ya tenemos en memoria
  var servicio = null;
  for (var i = 0; i < window.todosLosServicios.length; i++) {
    if (window.todosLosServicios[i].id == id) {
      servicio = window.todosLosServicios[i];
      break; // Encontramos el que buscábamos, salimos del loop
    }
  }

  if (!servicio) return; // Si no lo encontramos, no hacemos nada

  // Llenamos los campos con los datos del servicio
  document.getElementById('campo-nombre').value      = servicio.nombre;
  document.getElementById('campo-descripcion').value = servicio.descripcion || '';
  document.getElementById('campo-categoria').value   = servicio.categoria   || '';
  document.getElementById('campo-precio').value      = servicio.precio      || '';
  document.getElementById('error-formulario').innerHTML = '';

  document.getElementById('titulo-modal').textContent = 'Editar servicio';

  var modal = new bootstrap.Modal(document.getElementById('modalServicio'));
  modal.show();
}

// 5. GUARDAR (crear o actualizar según idEnEdicion)

function guardarServicio() {
  /*
    Lee los valores del formulario y los manda al servidor.
    Si idEnEdicion tiene un número → actualiza.
    Si idEnEdicion es null        → crea uno nuevo.
  */

  // Leemos los valores de cada campo
  var nombre      = document.getElementById('campo-nombre').value.trim();
  var descripcion = document.getElementById('campo-descripcion').value.trim();
  var categoria   = document.getElementById('campo-categoria').value;
  var precio      = document.getElementById('campo-precio').value;

  // Validación simple
  if (nombre === '') {
    document.getElementById('error-formulario').innerHTML =
      '<div class="alert alert-danger py-2">El nombre es obligatorio.</div>';
    return;
  }

  // Armamos el objeto con los datos a enviar
  var datos = {
    id:          idEnEdicion,
    nombre:      nombre,
    descripcion: descripcion,
    categoria:   categoria,
    precio:      precio || null
  };

  // Decidimos qué archivo PHP usar y qué método HTTP
  var url;
  var metodo;
  if (idEnEdicion) {
    url    = API + '/actualizar.php';
    metodo = 'PUT';    // PUT = actualizar algo existente
  } else {
    url    = API + '/crear.php';
    metodo = 'POST';   // POST = crear algo nuevo
  }

  // Enviamos los datos al servidor con fetch()
  fetch(url, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json'  // Le decimos que mandamos JSON
    },
    body: JSON.stringify(datos)  // Convertimos el objeto a texto JSON
  })
  .then(function(respuesta) {
    return respuesta.json();
  })
  .then(function(resultado) {
    // Cerramos el modal
    bootstrap.Modal.getInstance(document.getElementById('modalServicio')).hide();
    // Recargamos la lista de servicios
    cargarServicios();
    // Mostramos mensaje de éxito
    mostrarMensaje(idEnEdicion ? 'Servicio actualizado ✅' : 'Servicio creado ✅');
  })
  .catch(function(error) {
    document.getElementById('error-formulario').innerHTML =
      '<div class="alert alert-danger py-2">Error al guardar. Intenta de nuevo.</div>';
  });
}

// 6. ELIMINAR

function eliminarServicio(id, nombre) {
  /*
    Pide confirmación y luego elimina el servicio.
    confirm() muestra un diálogo de sí/no en el navegador.
  */

  var confirmar = confirm('¿Eliminar el servicio "' + nombre + '"?\nEsta acción no se puede deshacer.');

  if (!confirmar) return; // Si dice no, no hacemos nada

  fetch(API + '/eliminar.php', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id })
  })
  .then(function(respuesta) {
    return respuesta.json();
  })
  .then(function(resultado) {
    cargarServicios();
    mostrarMensaje('Servicio eliminado 🗑️');
  });
}

// 7. UTILIDAD: mostrar mensaje temporal

function mostrarMensaje(texto) {
  /*
    Muestra un pequeño mensaje en la esquina de la pantalla
    que desaparece solo después de 3 segundos.
    Usa el componente Toast de Bootstrap.
  */
  var toastEl = document.getElementById('mensaje-toast');
  toastEl.querySelector('.toast-body').textContent = texto;
  var toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
}

// INICIO: esto se ejecuta cuando la página termina de cargar

document.addEventListener('DOMContentLoaded', function() {
  /*
    DOMContentLoaded = "el HTML ya está listo en el navegador"
    Es el momento correcto para empezar a trabajar con la página.
  */
  cargarServicios(); // Cargamos todos los servicios al inicio
});
