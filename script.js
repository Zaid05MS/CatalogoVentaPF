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

function mostrarCarrito() {
  let contenedor = document.getElementById("carrito");

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

function validarCompra() {
  let nombre = document.getElementById("cliente").value;
  let direccion = document.getElementById("direccion").value;

  if (nombre === "" || direccion === "") {
    alert("Completa todos los campos");
    return;
  }

  if (carrito.length === 0) {
    alert("El carrito esta vacio");
    return;
  }

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