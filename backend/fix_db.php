<?php
// backend/fix_db.php
require_once 'database.php';

try {
    // 1. Tentar adicionar data_saida_prevista
    try {
        $pdo->exec("ALTER TABLE alocacoes ADD COLUMN data_saida_prevista DATE NULL AFTER data_entrada;");
        echo "Coluna data_saida_prevista adicionada.\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
            echo "Coluna data_saida_prevista já existe.\n";
        } else {
            throw $e;
        }
    }
    
    // 2. Sincronizar ENUM do status
    $pdo->exec("ALTER TABLE alocacoes MODIFY COLUMN status ENUM('Ativo', 'Historico', 'Finalizado') DEFAULT 'Ativo';");
    echo "ENUM de status sincronizado.\n";

    echo "Correção finalizada!\n";

} catch (PDOException $e) {
    echo "ERRO CRÍTICO: " . $e->getMessage() . "\n";
}
?>
