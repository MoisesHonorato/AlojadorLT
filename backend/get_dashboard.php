<?php
// backend/get_dashboard.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once 'database.php';
require_once 'auth.php';

// check_auth(); // Descomente para produção

try {
    // 1. Totais Gerais
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM republicas");
    $total_republicas = $stmt->fetch()['total'];

    $stmt = $pdo->query("SELECT SUM(capacidade_vagas) as total FROM quartos");
    $vagas_totais = $stmt->fetch()['total'] ?? 0;

    $stmt = $pdo->query("SELECT COUNT(*) as total FROM alocacoes WHERE status = 'Ativo'");
    $vagas_ocupadas = $stmt->fetch()['total'];

    // 2. Dados por República (usando a VIEW que criamos)
    $stmt = $pdo->query("
        SELECT 
            republica_nome as name,
            SUM(vagas_totais) as capacity,
            SUM(vagas_ocupadas) as occupancy,
            COUNT(quarto_id) as total_rooms
        FROM v_quartos_vagas
        GROUP BY republica_nome
    ");
    $republicas = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'summary' => [
            'total_republicas' => $total_republicas,
            'vagas_totais'     => $vagas_totais,
            'vagas_ocupadas'   => $vagas_ocupadas,
            'vagas_livres'     => $vagas_totais - $vagas_ocupadas
        ],
        'republicas' => $republicas
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
