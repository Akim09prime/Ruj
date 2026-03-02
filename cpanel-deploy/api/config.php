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
define('SESSION_DIR', BASE_DIR . 'sessions/');

if (!file_exists(DATA_DIR)) mkdir(DATA_DIR, 0755, true);
if (!file_exists(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);
if (!file_exists(SESSION_DIR)) mkdir(SESSION_DIR, 0755, true);

// Force PHP to save sessions in our controlled directory
session_save_path(SESSION_DIR);

// Relax cookie settings slightly for shared hosting compatibility
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
// Remove secure and samesite strictness temporarily to isolate the issue
// ini_set('session.cookie_secure', 1); 
// ini_set('session.cookie_samesite', 'Lax');

// Set a longer session timeout
ini_set('session.gc_maxlifetime', 86400);
ini_set('session.cookie_lifetime', 86400);

session_start();
?>
