<?php
// backend/checkout.php
require_once 'cors.php';
header('Content-Type: application/json');
require_once 'database.php';
require_once 'auth.php';

$data = json_decode(file_get_contents('php://input'), true);
$colab_id = $data['colaborador_id'] ?? null;
$quarto_id = $data['quarto_id'] ?? null;

try {
    $stmt = $pdo->prepare("UPDATE alocacoes SET status = 'Finalizado', data_saida_prevista = CURDATE() WHERE colaborador_id = ? AND quarto_id = ? AND status = 'Ativo'");
    $stmt->execute([$colab_id, $quarto_id]);
    
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
