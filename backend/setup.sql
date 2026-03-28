CREATE DATABASE IF NOT EXISTS alojadorlt;
USE alojadorlt;

-- Tabela de Usuários para Autenticação
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil ENUM('admin', 'visualizador') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Repúblicas
CREATE TABLE IF NOT EXISTS republicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    endereco TEXT,
    capacidade_total INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Quartos
CREATE TABLE IF NOT EXISTS quartos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    republica_id INT NOT NULL,
    numero_quarto VARCHAR(20) NOT NULL,
    capacidade_vagas INT DEFAULT 0,
    FOREIGN KEY (republica_id) REFERENCES republicas(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Colaboradores
CREATE TABLE IF NOT EXISTS colaboradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    cargo VARCHAR(100),
    empresa VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Alocações
CREATE TABLE IF NOT EXISTS alocacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    colaborador_id INT NOT NULL,
    quarto_id INT NOT NULL,
    data_entrada DATE NOT NULL,
    data_saida_prevista DATE,
    status ENUM('Ativo', 'Finalizado') DEFAULT 'Ativo',
    FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON DELETE CASCADE,
    FOREIGN KEY (quarto_id) REFERENCES quartos(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir um usuário administrador padrão (senha: admin123)
-- Usaremos password_hash futuramente no PHP, mas para o setup inicial:
INSERT INTO usuarios (nome, email, senha, perfil) 
VALUES ('Administrador', 'admin@alojador.com', '$2y$10$w0u3N2s7nI70x6D4X4U6z.R7E0U0B1E0O2G6T4H2E/F3G4H5I6J7K', 'admin');

-- VIEW para facilitar saber as vagas disponíveis
CREATE OR REPLACE VIEW v_quartos_vagas AS
SELECT 
    q.id AS quarto_id,
    q.numero_quarto,
    r.nome AS republica_nome,
    q.capacidade_vagas AS vagas_totais,
    (SELECT COUNT(*) FROM alocacoes a WHERE a.quarto_id = q.id AND a.status = 'Ativo') AS vagas_ocupadas,
    (q.capacidade_vagas - (SELECT COUNT(*) FROM alocacoes a WHERE a.quarto_id = q.id AND a.status = 'Ativo')) AS vagas_disponiveis
FROM quartos q
JOIN republicas r ON q.republica_id = r.id;

-- Dados para Teste Inicial
INSERT INTO republicas (nome, endereco, capacidade_total) VALUES 
('República Pantanal', 'Rua das Flores, 123 - Centro', 10),
('República Cerrado', 'Av. das Árvores, 456 - Norte', 6);

INSERT INTO quartos (republica_id, numero_quarto, capacidade_vagas) VALUES 
(1, 'Q01', 4),
(1, 'Q02', 6),
(2, 'Q01', 3),
(2, 'Q02', 3);

INSERT INTO colaboradores (nome, cpf, cargo, empresa) VALUES 
('João Silva', '123.456.789-00', 'Pedreiro', 'Construtora LT'),
('Maria Oliveira', '987.654.321-11', 'Arquiteta', 'Engenharia Pro'),
('Pedro Souza', '456.789.123-22', 'Servente', 'Subempreiteira X');

-- Alocar João no Quarto 1 da República Pantanal
INSERT INTO alocacoes (colaborador_id, quarto_id, data_entrada) VALUES 
(1, 1, CURDATE());
