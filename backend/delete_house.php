<?php
// backend/delete_house.php
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
    // 1. Verificar se há pessoas alocadas em qualquer quarto desta republica
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM alocacoes a JOIN quartos q ON a.quarto_id = q.id WHERE q.republica_id = ? AND a.data_saida IS NULL");
    $stmt->execute([$id]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'error' => 'Não é possível excluir: Há pessoas alocadas nesta república.']);
        exit;
    }

    // 2. Excluir os quartos (opcional, ou Cascade no banco)
    $stmt = $pdo->prepare("DELETE FROM quartos WHERE republica_id = ?");
    $stmt->execute([$id]);

    // 3. Excluir a republica
    $stmt = $pdo->prepare("DELETE FROM republicas WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Erro ao excluir: ' . $e->getMessage()]);
}
?>
