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

// Khởi chạy ứng dụng
$app = new App();