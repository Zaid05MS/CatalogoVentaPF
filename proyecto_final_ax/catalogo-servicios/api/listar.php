<?php
include "db.php";

$stmt = $db->query("SELECT * FROM servicios WHERE activo = 1");
$servicios = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($servicios);