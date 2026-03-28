<?php
// backend/save_room.php
require_once 'cors.php';
header('Content-Type: application/json');
require_once 'database.php';
require_once 'auth.php';

check_auth();

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['republica_id']) || !isset($data['nome'])) {
    echo json_encode(['success' => false, 'error' => 'Dados incompletos.']);
    exit;
}

$republica_id = $data['republica_id'];
$nome = $data['nome'];
$capacidade = (int)($data['capacidade'] ?? 0);
$id = $data['id'] ?? null;

if ($capacidade <= 0) {
    echo json_encode(['success' => false, 'error' => 'A capacidade deve ser maior que zero.']);
    exit;
}

try {
    if ($id) {
        // Ao editar a capacidade, verificar se já existem mais pessoas alocadas do que a nova capacidade
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM alocacoes WHERE quarto_id = ? AND status = 'Ativo'");
        $stmt->execute([$id]);
        $currentPpl = $stmt->fetchColumn();
        
        if ($capacidade < $currentPpl) {
            echo json_encode(['success' => false, 'error' => "Não é possível reduzir para $capacidade: já existem $currentPpl pessoas no quarto."]);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE quartos SET numero_quarto = ?, capacidade_vagas = ? WHERE id = ?");
        $stmt->execute([$nome, $capacidade, $id]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO quartos (republica_id, numero_quarto, capacidade_vagas) VALUES (?, ?, ?)");
        $stmt->execute([$republica_id, $nome, $capacidade]);
        $id = $pdo->lastInsertId();
    }
    echo json_encode(['success' => true, 'id' => $id]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Erro ao salvar: ' . $e->getMessage()]);
}
?>
