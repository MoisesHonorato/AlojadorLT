<?php
// backend/get_collaborators.php
require_once 'cors.php';
header('Content-Type: application/json');
require_once 'database.php';
require_once 'auth.php';

// check_auth(); 

try {
    $stmt = $pdo->query("SELECT id, nome as name, cargo as role, cpf, empresa as company FROM colaboradores");
    $collaborators = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $final_data = array_map(function($c) {
        return [
            'id'      => (string)$c['id'],
            'name'    => $c['name'],
            'role'    => $c['role'],
            'cpf'     => $c['cpf'],
            'company' => $c['company']
        ];
    }, $collaborators);

    echo json_encode($final_data);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
