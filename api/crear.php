<?php


header('Content-Type: application/json');
include 'db.php';

// Leemos los datos que mandó JavaScript en formato JSON
// file_get_contents('php://input') = "léeme lo que mandó el navegador"
$datos = json_decode(file_get_contents('php://input'), true);

// Validación: el nombre es obligatorio
if (empty($datos['nombre'])) {
    // Respondemos con error 400 (petición incorrecta)
    http_response_code(400);
    echo json_encode(['error' => 'El nombre es obligatorio']);
    exit; // Detenemos el script aquí
}

// Preparamos la consulta SQL para insertar
// Los ":" son marcadores de posición (evitan errores de seguridad)
$consulta = $db->prepare("
    INSERT INTO servicios (nombre, descripcion, categoria, precio)
    VALUES (:nombre, :descripcion, :categoria, :precio)
");

// Ejecutamos la consulta con los datos reales
$consulta->execute([
    ':nombre'      => $datos['nombre'],
    ':descripcion' => $datos['descripcion'] ?? '',
    ':categoria'   => $datos['categoria']   ?? '',
    ':precio'      => $datos['precio']      ?? null,
]);

// Respondemos con éxito (201 = "creado correctamente")
http_response_code(201);
echo json_encode(['mensaje' => 'Servicio guardado correctamente']);
