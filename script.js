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