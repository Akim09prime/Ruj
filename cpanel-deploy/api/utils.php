<?php
// api/utils.php
require_once 'config.php';

function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function errorResponse($message, $status = 400) {
    jsonResponse(['error' => $message], $status);
}

function getJsonInput() {
    $input = json_decode(file_get_contents('php://input'), true);
    return $input ?? [];
}

function isAuthenticated() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

function requireAuth() {
    if (!isAuthenticated()) {
        errorResponse('Unauthorized', 401);
    }
}
?>
