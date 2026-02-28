<?php
// api/config.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

define('BASE_DIR', __DIR__ . '/../');
define('DATA_DIR', BASE_DIR . 'data/');
define('UPLOAD_DIR', BASE_DIR . 'uploads/');

if (!file_exists(DATA_DIR)) mkdir(DATA_DIR, 0755, true);
if (!file_exists(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);

session_start();
?>
