<?php
// backend/setup_db.php
require_once 'database.php';

try {
    // 1. Create Usuarios
    $pdo->exec("CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        perfil VARCHAR(50) DEFAULT 'admin'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 2. Create Republicas
    $pdo->exec("CREATE TABLE IF NOT EXISTS republicas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        endereco VARCHAR(255)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 3. Create Quartos
    $pdo->exec("CREATE TABLE IF NOT EXISTS quartos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        republica_id INT NOT NULL,
        numero_quarto VARCHAR(50) NOT NULL,
        capacidade_vagas INT NOT NULL DEFAULT 1,
        FOREIGN KEY (republica_id) REFERENCES republicas(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 4. Create Colaboradores
    $pdo->exec("CREATE TABLE IF NOT EXISTS colaboradores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        cpf VARCHAR(20) UNIQUE,
        cargo VARCHAR(100),
        empresa VARCHAR(100)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 5. Create Alocacoes
    $pdo->exec("CREATE TABLE IF NOT EXISTS alocacoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        colaborador_id INT NOT NULL,
        quarto_id INT NOT NULL,
        data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('Ativo', 'Historico') DEFAULT 'Ativo',
        FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE CASCADE,
        FOREIGN KEY (quarto_id) REFERENCES quartos(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 6. Insert Default Admin User
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM usuarios WHERE email = 'admin@alojador.com'");
    $stmt->execute();
    if ($stmt->fetchColumn() == 0) {
        $senha_hash = password_hash('admin123', PASSWORD_DEFAULT);
        $pdo->prepare("INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)")
            ->execute(['Administrador', 'admin@alojador.com', $senha_hash, 'admin']);
        echo "Usuário admin criado (admin@alojador.com / admin123)\n";
    }

    echo "Tabelas criadas com sucesso no banco online!\n";

} catch (PDOException $e) {
    echo "ERRO: " . $e->getMessage() . "\n";
}
?>
