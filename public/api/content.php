<?php
// api/content.php
require_once 'utils.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $file = $_GET['file'] ?? '';
    if (!$file) {
        errorResponse('File parameter missing');
    }
    
    // Security check: allow only alphanumeric, dashes, underscores, and .json extension
    if (!preg_match('/^[a-z0-9_\-]+\.json$/i', $file)) {
        errorResponse('Invalid filename');
    }

    $path = DATA_DIR . $file;
    if (file_exists($path)) {
        $content = file_get_contents($path);
        // Validate JSON
        $json = json_decode($content);
        if ($json === null) {
             jsonResponse([]); // Return empty if invalid
        }
        header('Content-Type: application/json');
        echo $content;
        exit;
    } else {
        // Return empty object/array if not found, or 404?
        // Frontend expects fallback if 404.
        http_response_code(404);
        echo json_encode(['error' => 'File not found']);
        exit;
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAuth();
    $input = getJsonInput();
    $file = $input['file'] ?? '';
    $data = $input['data'] ?? null;

    if (!$file || $data === null) {
        errorResponse('Missing file or data');
    }

    if (!preg_match('/^[a-z0-9_\-]+\.json$/i', $file)) {
        errorResponse('Invalid filename');
    }

    $path = DATA_DIR . $file;
    if (file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
        jsonResponse(['success' => true]);
    } else {
        errorResponse('Failed to write file', 500);
    }
} else {
    errorResponse('Method not allowed', 405);
}
?>
