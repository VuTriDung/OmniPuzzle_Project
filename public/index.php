<?php
// public/index.php
session_start(); // Khởi tạo session cho đăng nhập sau này

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Nạp các file lõi
require_once '../config/database.php';
require_once '../app/Core/Database.php';
require_once '../app/Core/Controller.php';
require_once '../app/Core/App.php';

// Đọc file .env và nạp vào biến siêu toàn cục $_ENV
$envPath = __DIR__ . '/../.env';
if (file_exists($envPath)) {
    $envVariables = parse_ini_file($envPath);
    foreach ($envVariables as $key => $value) {
        $_ENV[$key] = $value;
    }
}

// Khởi chạy ứng dụng
$app = new App();