let carrito = [];
let total = 0;

function agregarProducto(nombre, precio) {
  // Validación del ingreso de producto
  if (nombre === "" || precio <= 0) {
    alert("Producto inválido");
    return;
  }

  // Agregar producto al carrito
  carrito.push({ nombre: nombre, precio: precio });

  // Actualizar del total
  total = total + precio;

  alert("Producto agregado");

  mostrarCarrito();

  // Guarda el carrito
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function eliminarProducto(index) {
  // Restar del total
  total = total - carrito[index].precio;

  // Eliminar el producto
  carrito.splice(index, 1);

  mostrarCarrito();
}

// Muestra el carrito
function mostrarCarrito() {
  let contenedor = document.getElementById("carrito");
  let totalElemento = document.getElementById("total");

  if(!contenedor || !totalElemento) return;

  // Limpiar el contenedor
  contenedor.innerHTML = "";

  // Recorrer carrito
  for (let i = 0; i < carrito.length; i++) {
    contenedor.innerHTML +=
      "<p>" +
    carrito[i].nombre +
      " - $" +
    carrito[i].precio +
      " <button onclick='eliminarProducto(" + i + ")'>Eliminar</button>" +
      "</p>";
  }

  // Mostrar total actualizado
  document.getElementById("total").innerHTML = "Total: $" + total;

}

// Valida la compra
function validarCompra() {
  let nombre = document.getElementById("cliente").value;
  let direccion = document.getElementById("direccion").value;

  if (nombre === "" || direccion === "" || carrito.length === 0) {
    alert("Completa todos los campos");
    return;
  }

  // Mensaje para WhatsApp
  let texto = "Hola, soy " + nombre + ". Quiero cotizar: ";

  carrito.forEach(function(p) {
    texto +=
    p.nombre + " ($" + p.precio + "), ";
  });

  // Abrir WhatsApp
  window.open(
    `https://wa.me/523328056256?text=${texto}`,
    "_blank"
  );

  alert("Compra realizada con exito");

  // Se reinicia el carro
  carrito = [];
  total = 0;
  
  mostrarCarrito();
}

// Muestra detalles de los productos
imagen.onclick = function() {
  mostrarDetalles(producto);
}

// Recupera el carrito si se recarga la pagina
window.onload = function() {
  let carritoGuardado = localStorage.getItem("carrito");

  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    mostrarCarrito();
  }
}

// Confirma la compra
function finalizarCompra() {
  let confirmarCompra = confirm("¿Deseas finalizar la compra?");

  if (confirmarCompra) {
    alert("Compra realizada");
  } else {
    alert("Compra cancelada");
  }
}

// Muestra la orden de compra
function mostrarOrden() {
  let contenedor = document.getElementById("orden");
  let contenido = "<h3>Orden de compra</h3>";

  for (let i = 0; i < carrito.length; i++) {

    contenido +=
      "<p>" +
      carrito[i].nombre +
      " - $" +
      carrito[i].precio +
      "</p>";
  }

  contenido += "<h4>Total: $" + total + "</h4>";

  contenedor.innerHTML = contenido;
}

// Poder cotizar un evento
function cotizarEvento() {
  let personas = document.getElementById("personas").value;
  let totalEvento = personas * 150;

  document.getElementById("resultadoEvento").innerHTML =
    "Total: $" + totalEvento;
}

// Inicio de sesion
function iniciarSesion() {
  let correo = document.getElementById("correo").value;
  let password = document.getElementById("password").value;

  if (correo === "" || password === "") {
    alert("Completa todos los campos");
    return;
  }

  if (!correo.includes("@")) {
    alert("Correo inválido");
    return;
  }

  alert("Datos enviados");
}

// Solo permite que se ingresen correos gmail o hotmail
function validarCorreo() {
  let correo =
    document.getElementById("correo").value;

  if (
    correo.includes("@gmail.com") ||
    correo.includes("@hotmail.com")
  ) {
    alert("Cotización enviada");
  } else {
    alert(
      "Solo se aceptan correos Gmail o Hotmail"
    );
  }
}
