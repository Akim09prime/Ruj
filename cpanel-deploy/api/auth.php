<?php
// api/auth.php
require_once 'utils.php';

$action = $_GET['action'] ?? '';
$usersFile = DATA_DIR . 'users.json';

function getUsers() {
    global $usersFile;
    if (!file_exists($usersFile)) {
        return [];
    }
    return json_decode(file_get_contents($usersFile), true) ?? [];
}

function saveUsers($users) {
    global $usersFile;
    return file_put_contents($usersFile, json_encode($users));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($action === 'login') {
        $input = getJsonInput();
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';

        $users = getUsers();

        if (isset($users[$username]) && password_verify($password, $users[$username])) {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_user'] = $username;
            jsonResponse(['success' => true, 'message' => 'Login successful']);
        } else {
            errorResponse('Invalid credentials', 401);
        }
    } elseif ($action === 'logout') {
        session_destroy();
        jsonResponse(['success' => true, 'message' => 'Logged out']);
    } elseif ($action === 'change_password') {
        requireAuth();
        $input = getJsonInput();
        $new_pass = $input['new_password'] ?? '';
        
        if (strlen($new_pass) < 6) {
            errorResponse('Password too short (min 6 chars)');
        }

        $users = getUsers();
        $currentUser = $_SESSION['admin_user'] ?? 'admin';
        
        $users[$currentUser] = password_hash($new_pass, PASSWORD_DEFAULT);
        
        if (saveUsers($users)) {
            jsonResponse(['success' => true, 'message' => 'Password changed']);
        } else {
            errorResponse('Failed to save password', 500);
        }
    } else {
        errorResponse('Invalid action');
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'session') {
        jsonResponse(['authenticated' => isAuthenticated()]);
    } else {
        errorResponse('Invalid action');
    }
} else {
    errorResponse('Method not allowed', 405);
}
?>
