<?php
// backend/logout.php
require_once 'cors.php';
header('Content-Type: application/json');
require_once 'auth.php';

$result = logout();
echo json_encode($result);
?>
