<?php
// backend/save_collaborator.php
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
$cpf = $data['cpf'] ?? null;
$cargo = $data['cargo'] ?? null;
$empresa = $data['empresa'] ?? null;
$id = $data['id'] ?? null;

try {
    if ($id) {
        $stmt = $pdo->prepare("UPDATE colaboradores SET nome = ?, cpf = ?, cargo = ?, empresa = ? WHERE id = ?");
        $stmt->execute([$nome, $cpf, $cargo, $empresa, $id]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO colaboradores (nome, cpf, cargo, empresa) VALUES (?, ?, ?, ?)");
        $stmt->execute([$nome, $cpf, $cargo, $empresa]);
    }
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(['success' => false, 'error' => 'CPF já cadastrado.']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Erro ao salvar: ' . $e->getMessage()]);
    }
}
?>
