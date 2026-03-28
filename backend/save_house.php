<?php
// backend/save_house.php
require_once 'cors.php';
header('Content-Type: application/json');
require_once 'database.php';
require_once 'auth.php';

check_auth();

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['nome'])) {
    echo json_encode(['success' => false, 'error' => 'Dados incompletos.']);
    exit;
}

$nome = $data['nome'];
$endereco = $data['endereco'] ?? '';
$id = $data['id'] ?? null;

try {
    if ($id) {
        $stmt = $pdo->prepare("UPDATE republicas SET nome = ?, endereco = ? WHERE id = ?");
        $stmt->execute([$nome, $endereco, $id]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO republicas (nome, endereco) VALUES (?, ?)");
        $stmt->execute([$nome, $endereco]);
        $id = $pdo->lastInsertId();
    }
    echo json_encode(['success' => true, 'id' => $id]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Erro ao salvar: ' . $e->getMessage()]);
}
?>
