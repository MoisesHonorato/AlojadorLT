<?php
// backend/migrate.php

$host = 'localhost';
$user = 'root';
$pass = '';

try {
    // 1. Conectar ao MySQL sem banco específico
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 2. Ler o arquivo setup.sql
    $sqlFile = __DIR__ . '/setup.sql';
    if (!file_exists($sqlFile)) {
        die("Arquivo setup.sql não encontrado em: $sqlFile\n");
    }
    
    $sql = file_get_contents($sqlFile);
    
    // 3. Executar o SQL (que já contém CREATE DATABASE IF NOT EXISTS alojadorlt)
    // O PDO exec() às vezes tem limitações com multi-queries dependendo da libmysql.
    // Vamos usar o PDO::ATTR_EMULATE_PREPARES para permitir scripts longos.
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, 0);
    $pdo->exec($sql);
    
    echo "Sucesso: Tabelas criadas e dados de teste inseridos!\n";

} catch (PDOException $e) {
    echo "Erro ao migrar banco de dados: " . $e->getMessage() . "\n";
    exit(1);
}
?>
