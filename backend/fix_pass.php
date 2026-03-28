<?php
// backend/fix_pass.php
require_once 'database.php';
$pass = password_hash('admin123', PASSWORD_BCRYPT);
$stmt = $pdo->prepare("UPDATE usuarios SET senha = ? WHERE email = 'admin@alojador.com'");
$stmt->execute([$pass]);
echo "Senha do admin atualizada com sucesso!\n";
?>
