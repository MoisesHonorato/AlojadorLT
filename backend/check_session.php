<?php
// backend/check_session.php
require_once 'cors.php';
header('Content-Type: application/json');

if (isset($_SESSION['usuario_id'])) {
    echo json_encode([
        'authenticated' => true,
        'user'          => [
            'id'     => $_SESSION['usuario_id'],
            'nome'   => $_SESSION['usuario_nome'],
            'perfil' => $_SESSION['usuario_perfil']
        ]
    ]);
} else {
    echo json_encode(['authenticated' => false]);
}
?>
