# 🗺️ Mapa de Desenvolvimento - AlojadorLT

Este documento serve como o guia mestre para a configuração e evolução do sistema **AlojadorLT**. 

### 🎯 Objetivo Principal
Gerenciar alojamentos (repúblicas) de forma eficiente:
1.  **Saber quantos alojamentos temos.**
2.  **Saber quantos quartos existem em cada alojamento.**
3.  **Monitorar o número de vagas totais e disponíveis por quarto.**
4.  **Alocar colaboradores em vagas específicas**, garantindo que nenhum quarto exceda sua capacidade.

**Filosofia do Projeto:** 📱 **Mobile-First** (O sistema deve ser perfeito primeiro no celular).

---

## ✅ Concluído (Fase 1: Infraestrutura e Backend Base)

- [x] **Modelagem do Banco de Dados (MySQL)**: Criada a estrutura de tabelas para Repúblicas, Quartos, Colaboradores, Alocações e Usuários.
- [x] **Configuração de Conexão**: Arquivo `backend/database.php` configurado para o banco `alojadorlt` (root/"").
- [x] **Sistema de Autenticação**: Implementada lógica de login, logout e verificação de sessão via PHP.
- [x] **Segurança Inicial**: Senhas criptografadas com `password_hash`.

---

## 🚀 Próximos Passos (Obrigatórios para o funcionamento)

### 1. Configuração do Ambiente Local (WAMP/XAMPP)
- [ ] Certifique-se de que o **Apache** e **MySQL** estão rodando.
- [ ] Importe o esquema do banco de dados:
  - Abra o PHPMyAdmin.
  - Crie o banco de dados `alojadorlt`.
  - Importe o arquivo: `c:\wamp64\www\AlojadorLT\backend\setup.sql`.

### 2. Desenvolvimento do Frontend (Vite + React)
- [ ] **Integração Auth**: Criar tela de login no React conectando com `backend/login.php`.
- [ ] **Design Mobile-First**: 
  - Utilizar Tailwind CSS para garantir responsividade total.
  - Focar em botões e inputs fáceis de tocar no celular.
  - Menu hambúrguer e navegação intuitiva por gestos.

### 3. Funcionalidades de Gestão (CRUDs)
- [ ] Gestão de **Repúblicas** (Adicionar, Editar, Excluir).
- [ ] Gestão de **Quartos** vinculado às Repúblicas.
- [ ] Cadastro de **Colaboradores** com validação de CPF.
- [ ] Tela de **Alocações** (Onde acontece a mágica: colocar o colaborador no quarto).

---

## 🛠️ Detalhes Técnicos Importantes
- **Backend**: PHP 7.4+ (puro) via PDO.
- **Frontend**: React + Vite + Tailwind CSS.
- **Banco de Dados**: MySQL.
- **Credenciais Iniciais (Teste)**:
  - **Login**: `admin@alojador.com`
  - **Senha**: `admin123`

---

> [!IMPORTANT]
> **Aviso de Mobile-First**: Cada componente novo deve ser testado primeiro na Resolução de Celular (Inspecionar Elemento > Toggle Device Toolbar). Se não funcionar bem no celular, não está pronto.

---
*Este arquivo será atualizado conforme avançamos no desenvolvimento.*
