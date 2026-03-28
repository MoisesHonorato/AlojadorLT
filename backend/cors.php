<?php
// backend/cors.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_samesite', 'Lax');

// Robust CORS
$allowed_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (!$allowed_origin && isset($_SERVER['HTTP_HOST'])) {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https" : "http";
    $allowed_origin = $protocol . "://" . $_SERVER['HTTP_HOST'];
}

header("Access-Control-Allow-Origin: $allowed_origin");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
?>
