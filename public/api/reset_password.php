<?php
// api/reset_password.php
require_once 'utils.php';

// Check if we can write to data dir
if (!is_writable(DATA_DIR)) {
    die("Error: The data directory (" . DATA_DIR . ") is not writable. Please check permissions.");
}

$usersFile = DATA_DIR . 'users.json';
$users = [];

if (file_exists($usersFile)) {
    $content = file_get_contents($usersFile);
    $users = json_decode($content, true);
    if (!is_array($users)) {
        $users = [];
    }
}

// The hash for 'carvello2024'
$newHash = '$2y$10$3dmeX0U6kEeVCzPFYuDqxeW7J.3zEkr.5pg28cH6mghlQ07I117C2';

$users['admin'] = [
    'password' => $newHash,
    'role' => 'admin'
];

if (file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT))) {
    echo "<h1>Password Reset Successful</h1>";
    echo "<p>Admin user password has been reset to: <strong>carvello2024</strong></p>";
    echo "<p>File updated: " . $usersFile . "</p>";
    echo "<p style='color: red; font-weight: bold;'>IMPORTANT: Please delete this file (api/reset_password.php) from your server immediately.</p>";
    echo "<a href='/admin/login'>Go to Login</a>";
} else {
    echo "<h1>Error</h1>";
    echo "<p>Failed to write to users.json. Please check file permissions.</p>";
}
?>
