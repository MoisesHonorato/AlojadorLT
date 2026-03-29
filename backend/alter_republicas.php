<?php
require_once 'database.php';
try {
    $pdo->exec("ALTER TABLE republicas ADD COLUMN gender VARCHAR(20) DEFAULT 'Misto'");
    echo "Coluna 'gender' adicionada com sucesso.\n";
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "Coluna 'gender' já existe.\n";
    } else {
        echo "Erro: " . $e->getMessage() . "\n";
    }
}
?>
