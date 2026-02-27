<?php
// utils.php
require_once 'config.php';

function json_response($data, $status = 200) {
    if (ob_get_length()) ob_clean();
    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($data);
    exit();
}

function error_response($message, $status = 400) {
    json_response(['error' => $message], $status);
}

function get_json_input() {
    $input = file_get_contents('php://input');
    return json_decode($input, true);
}

function get_auth_header() {
    $headers = null;
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER["Authorization"]);
    } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) { // Nginx or fast CGI
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    return $headers;
}

function check_auth() {
    $auth_header = get_auth_header();
    if (!empty($auth_header) && preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
        $token = $matches[1];
        $auth_data = get_data_file('auth');
        if (isset($auth_data['token']) && $auth_data['token'] === $token && isset($auth_data['token_expires']) && $auth_data['token_expires'] > time()) {
            return true;
        }
    }
    error_response('Unauthorized', 401);
}

function sanitize_filename($filename) {
    // Remove dangerous characters
    $filename = preg_replace('/[^a-zA-Z0-9\._-]/', '', $filename);
    // Prevent directory traversal
    $filename = basename($filename);
    return $filename;
}

function get_data_file($filename) {
    $path = DATA_DIR . $filename . '.json';
    if (!file_exists($path)) {
        return [];
    }
    $content = file_get_contents($path);
    return json_decode($content, true) ?: [];
}

function save_data_file($filename, $data) {
    $path = DATA_DIR . $filename . '.json';
    
    // Create backup if file exists
    if (file_exists($path)) {
        $backup_dir = DATA_DIR . 'backups/';
        if (!is_dir($backup_dir)) {
            mkdir($backup_dir, 0755, true);
        }
        $backup_path = $backup_dir . $filename . '-' . date('Ymd-His') . '.json';
        copy($path, $backup_path);
        
        // Optional: Rotate backups (keep last 10)
        $files = glob($backup_dir . $filename . '-*.json');
        if (count($files) > 10) {
            usort($files, function($a, $b) { return filemtime($a) - filemtime($b); });
            unlink($files[0]); // Delete oldest
        }
    }
    
    return file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT));
}
?>
