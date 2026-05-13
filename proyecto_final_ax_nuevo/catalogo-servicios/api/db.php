<?php

$ruta_bd = __DIR__ . '/../db/catalogo.sqlite';
 
try {

    $db = new PDO('sqlite:' . $ruta_bd);

    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $db->exec("
        CREATE TABLE IF NOT EXISTS servicios (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre      TEXT NOT NULL,
            descripcion TEXT,
            categoria   TEXT,
            precio      REAL
        )
    ");
 
    $total = $db->query("SELECT COUNT(*) FROM servicios")->fetchColumn();
 
    if ($total == 0) {
 
        $db->exec("
            INSERT INTO servicios (nombre, descripcion, categoria, precio) VALUES
            ('Cabina de fotos',   'Accesorios divertidos e impresión instantánea.', 'fotografia', 2500),
            ('Plataforma 360',    'Video en 360 grados que captura cada momento.',  'video360',   3500),
            ('Espejo mágico',     'Pantalla táctil con impresión al instante.',     'fotografia', 3000),
            ('Totem fotográfico', 'Impresiones personalizadas de alta calidad.',    'fotografia', 2800),
            ('Carrito de shots',  'Bebidas y colores en la pista de baile.',        'bar',        1800),
            ('Snackin Emotions',  'Botanas y snacks personalizados a tu gusto.',    'bar',        1500),
            ('Alfombra roja',     'Entrada elegante con fondo personalizado.',      'decoracion', 2000)
        ");
 
    } 
 
} catch (PDOException $e) {

    http_response_code(500);
    echo json_encode(['error' => 'Error en la base de datos: ' . $e->getMessage()]);

    exit;
} 
