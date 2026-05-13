<?php
/*
  ¿QUÉ HACE ESTE ARCHIVO?
  -----------------------
  Elimina un servicio de la base de datos
  usando su ID.

  JavaScript lo llama con method: 'DELETE'
*/

header('Content-Type: application/json');
include 'db.php';

// Leemos el ID que mandó JavaScript
$datos = json_decode(file_get_contents('php://input'), true);

if (empty($datos['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Falta el ID del servicio']);
    exit;
}

// DELETE FROM elimina la fila donde id coincida
$consulta = $db->prepare("DELETE FROM servicios WHERE id = ?");
$consulta->execute([$datos['id']]);

echo json_encode(['mensaje' => 'Servicio eliminado correctamente']);
