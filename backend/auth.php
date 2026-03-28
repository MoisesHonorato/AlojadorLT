<?php
// backend/auth.php
function check_auth() {
    if (!isset($_SESSION['usuario_id'])) {
        header('HTTP/1.1 401 Unauthorized');
        echo json_encode(['error' => 'Usuário não autenticado.']);
        exit;
    }
}

function login($email, $senha) {
    global $pdo;
    
    $stmt = $pdo->prepare("SELECT id, nome, senha, perfil FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($senha, $user['senha'])) {
        $_SESSION['usuario_id'] = $user['id'];
        $_SESSION['usuario_nome'] = $user['nome'];
        $_SESSION['usuario_perfil'] = $user['perfil'];
        return ['success' => true, 'user' => ['id' => $user['id'], 'nome' => $user['nome'], 'perfil' => $user['perfil']]];
    }

    return ['success' => false, 'error' => 'E-mail ou senha incorretos.'];
}

function logout() {
    session_destroy();
    return ['success' => true];
}
?>
