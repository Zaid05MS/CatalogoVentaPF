<?php

header('Content-Type: application/json');

// Conectamos con la base de datos (usando el archivo db.php)
include 'db.php';

$categoria = $_GET['categoria'] ?? ''; // Si no viene nada, queda vacío

if ($categoria != '') {
    // El usuario filtró por categoría → buscamos solo esa categoría
    // Usamos "?" para evitar inyección SQL (buena práctica de seguridad)
    $consulta = $db->prepare("SELECT * FROM servicios WHERE categoria = ?");
    $consulta->execute([$categoria]);
} else {
    // No hay filtro → traemos todos los servicios
    $consulta = $db->query("SELECT * FROM servicios");
}

// Convertimos los resultados a un arreglo PHP
$servicios = $consulta->fetchAll(PDO::FETCH_ASSOC);

// Convertimos el arreglo PHP a texto JSON y lo enviamos
echo json_encode($servicios);
