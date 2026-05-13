<?php
/*
  ¿QUÉ HACE ESTE ARCHIVO?
  -----------------------
  Este archivo se encarga de DOS cosas:
  1. Conectarse a la base de datos SQLite
  2. Crear la tabla "servicios" si todavía no existe

  Todos los demás archivos PHP hacen:
    include 'db.php';
  ...para poder usar la base de datos.
*/

// ----------------------------------------------------------
// PASO 1: Decirle a PHP dónde está el archivo de la base de datos
// __DIR__ significa "la carpeta donde está este archivo"
// ----------------------------------------------------------
$ruta_bd = __DIR__ . '/../db/catalogo.sqlite';

// ----------------------------------------------------------
// PASO 2: Conectarse a SQLite usando PDO
// PDO es la forma que tiene PHP de hablar con bases de datos
// ----------------------------------------------------------
$db = new PDO('sqlite:' . $ruta_bd);

// Activar el modo de errores para que PHP nos avise si algo falla
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// ----------------------------------------------------------
// PASO 3: Crear la tabla si no existe todavía
// "CREATE TABLE IF NOT EXISTS" = solo la crea si aún no hay una
// ----------------------------------------------------------
$db->exec("
    CREATE TABLE IF NOT EXISTS servicios (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre      TEXT NOT NULL,
        descripcion TEXT,
        categoria   TEXT,
        precio      REAL
    )
");
/*
  EXPLICACIÓN DE LAS COLUMNAS:
  - id          → número único que se asigna solo (1, 2, 3...)
  - nombre      → texto con el nombre del servicio (obligatorio)
  - descripcion → texto largo con la descripción
  - categoria   → para filtrar: fotografia, video360, bar, decoracion
  - precio      → número con decimales (REAL = número con punto)
*/

// ----------------------------------------------------------
// PASO 4: Insertar datos de ejemplo si la tabla está vacía
// ----------------------------------------------------------
$total = $db->query("SELECT COUNT(*) FROM servicios")->fetchColumn();

if ($total == 0) {
    // Si no hay ningún registro, agregamos 7 servicios de ejemplo
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
