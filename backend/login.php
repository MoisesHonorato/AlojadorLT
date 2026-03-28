<?php
// backend/login.php
require_once 'cors.php';
header('Content-Type: application/json');
require_once 'database.php';
require_once 'auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = isset($data['email']) ? $data['email'] : null;
    $senha = isset($data['senha']) ? $data['senha'] : null;

    if (!$email || !$senha) {
         echo json_encode(['success' => false, 'error' => 'Por favor, informe e-mail e senha.']);
         exit;
    }

    $result = login($email, $senha);
    echo json_encode($result);
} else {
    echo json_encode(['success' => false, 'error' => 'Método não permitido.']);
}
?>
