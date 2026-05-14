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
            precio      REAL,
            imagen      TEXT
        )
    ");
 
    $total = $db->query("SELECT COUNT(*) FROM servicios")->fetchColumn();
 
    if ($total == 0) {
 
        $db->exec("
            INSERT INTO servicios (nombre, descripcion, categoria, precio, imagen) VALUES
            ('Carrito de Shots',   'Carrito iluminado de lujo, shots de colores ilimitados y animador con la máscara original de La Máscara.', 'bar',        2500, 'img/shotsServicio.jpg'),
            ('Hollywood Spotlight','Experiencia de alfombra roja con unifilares dorados y luces profesionales.', 'decoracion', 4800, 'img/alfombraNosotros.jpg'),
            ('Cabina de fotos',    'Cabina cerrada o abierta con impresión térmica instantánea y accesorios divertidos.',                      'fotografia', 3500, 'img/cabinaCatalogo.jpg'),
            ('Foto 360',           'Videos en slow motion de alta definición con software de última generación y descarga vía QR.',             'video360',   1800, 'img/foto360Catalogo.jpg'),
            ('Audio & DJ',         'Sistema de sonido profesional, DJ mezclando en vivo todos los géneros y cabina iluminada.',                'audio',      5500, 'img/audioCatalogo.jpg'),
            ('Letras Gigantes',    'Renta de iniciales o XV iluminadas con focos vintage tipo feria. Altura de 1.20m.',                        'decoracion', 1200, 'img/letrasCatalogo.jpg'),
            ('Pista de Baile',     'Pista LED pixelada con efectos de colores infinitos que reaccionan al ritmo de la música.',                'decoracion', 2550, 'img/pistaCatalogo.jpg'),
            ('Glow Production',    'Paquete completo de iluminación robótica, pantallas de visuales y efectos láser.',                         'iluminacion',2200, 'img/iluminacioCtalogo.jpg'),
            ('Accesorios & Props', 'Maletas con pelucas, lentes gigantes, boas, máscaras originales y letreros interactivos.',                 'fotografia', 3500, 'img/accesorioCata.jpg')
        ");
 
    } 
 
} catch (PDOException $e) {

    http_response_code(500);
    echo json_encode(['error' => 'Error en la base de datos: ' . $e->getMessage()]);

    exit;
} 
