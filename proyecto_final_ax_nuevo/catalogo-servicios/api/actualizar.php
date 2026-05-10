<?php

header('Content-Type: application/json');
include 'db.php';

// Leemos los datos que mandó JavaScript
$datos = json_decode(file_get_contents('php://input'), true);

// Necesitamos el ID para saber qué fila actualizar
if (empty($datos['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Falta el ID del servicio']);
    exit;
}

// UPDATE cambia los valores de una fila existente
// WHERE id = :id → solo cambia ESA fila, no todas
$consulta = $db->prepare("
    UPDATE servicios
    SET nombre      = :nombre,
        descripcion = :descripcion,
        categoria   = :categoria,
        precio      = :precio
    WHERE id = :id
");

$consulta->execute([
    ':id'          => $datos['id'],
    ':nombre'      => $datos['nombre'],
    ':descripcion' => $datos['descripcion'] ?? '',
    ':categoria'   => $datos['categoria']   ?? '',
    ':precio'      => $datos['precio']      ?? null,
]);

echo json_encode(['mensaje' => 'Servicio actualizado correctamente']);
