<?php
// backend/delete_room.php
require_once 'cors.php';
header('Content-Type: application/json');
require_once 'database.php';
require_once 'auth.php';

check_auth();

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id'])) {
    echo json_encode(['success' => false, 'error' => 'ID não fornecido.']);
    exit;
}

$id = $data['id'];

try {
    // 1. Verificar se há pessoas alocadas neste quarto
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM alocacoes WHERE quarto_id = ? AND data_saida IS NULL");
    $stmt->execute([$id]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'error' => 'Não é possível excluir: Há pessoas alocadas neste quarto.']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM quartos WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Erro ao excluir quarto: ' . $e->getMessage()]);
}
?>
