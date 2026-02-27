<?php
require_once 'utils.php';

$action = $_GET['action'] ?? '';

$auth_file = 'auth';

// Initial setup check
$auth_data = get_data_file($auth_file);
if (empty($auth_data)) {
    // Default password: 'admin' (hashed)
    // In production, this should be changed immediately
    $default_pass = password_hash('admin', PASSWORD_DEFAULT);
    $auth_data = ['hash' => $default_pass, 'attempts' => 0, 'lockout_time' => 0];
    save_data_file($auth_file, $auth_data);
}

switch ($action) {
    case 'login':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            error_response('Method not allowed', 405);
        }

        $input = get_json_input();
        $password = $input['password'] ?? '';

        // Brute force protection
        if ($auth_data['attempts'] >= 5) {
            if (time() < $auth_data['lockout_time']) {
                error_response('Too many attempts. Please try again later.', 429);
            } else {
                // Reset attempts after lockout period
                $auth_data['attempts'] = 0;
                $auth_data['lockout_time'] = 0;
                save_data_file($auth_file, $auth_data);
            }
        }

        if (password_verify($password, $auth_data['hash'])) {
            $token = bin2hex(random_bytes(16));
            $auth_data['token'] = $token;
            $auth_data['token_expires'] = time() + 86400; // 24 hours
            
            // Reset attempts on success
            $auth_data['attempts'] = 0;
            $auth_data['lockout_time'] = 0;
            save_data_file($auth_file, $auth_data);
            
            json_response(['success' => true, 'token' => $token]);
        } else {
            // Increment attempts
            $auth_data['attempts']++;
            if ($auth_data['attempts'] >= 5) {
                $auth_data['lockout_time'] = time() + 900; // 15 minutes lockout
            }
            save_data_file($auth_file, $auth_data);
            
            error_response('Invalid password', 401);
        }
        break;

    case 'logout':
        $auth_header = get_auth_header();
        if (!empty($auth_header) && preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
            $token = $matches[1];
            $auth_data = get_data_file($auth_file);
            if (isset($auth_data['token']) && $auth_data['token'] === $token) {
                unset($auth_data['token']);
                unset($auth_data['token_expires']);
                save_data_file($auth_file, $auth_data);
            }
        }
        json_response(['success' => true]);
        break;

    case 'check':
        $auth_header = get_auth_header();
        if (!empty($auth_header) && preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
            $token = $matches[1];
            $auth_data = get_data_file($auth_file);
            if (isset($auth_data['token']) && $auth_data['token'] === $token && isset($auth_data['token_expires']) && $auth_data['token_expires'] > time()) {
                json_response(['authenticated' => true]);
            }
        }
        json_response(['authenticated' => false]);
        break;
        
    case 'change_password':
        check_auth(); // Ensure user is logged in
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            error_response('Method not allowed', 405);
        }
        
        $input = get_json_input();
        $new_password = $input['password'] ?? '';
        
        if (strlen($new_password) < 6) {
            error_response('Password must be at least 6 characters', 400);
        }
        
        $auth_data['hash'] = password_hash($new_password, PASSWORD_DEFAULT);
        $auth_data['attempts'] = 0;
        $auth_data['lockout_time'] = 0;
        save_data_file($auth_file, $auth_data);
        
        json_response(['success' => true]);
        break;

    default:
        error_response('Invalid action', 400);
}
?>
