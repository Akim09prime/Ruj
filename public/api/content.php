<?php
require_once 'utils.php';

$type = $_GET['type'] ?? '';
$action = $_GET['action'] ?? 'read';

// Allowed content types
$allowed_types = [
    'hero', 'services', 'portfolio', 'gallery', 'process', 
    'reviews', 'about', 'contact', 'settings', 'timeline', 'faq'
];

if (!in_array($type, $allowed_types)) {
    error_response('Invalid content type', 400);
}

$filename = $type;
$data = get_data_file($filename);

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        json_response($data);
        break;

    case 'POST':
    case 'PUT':
        check_auth(); // Ensure user is logged in
        
        $input = get_json_input();
        
        // Validate input if necessary
        if (empty($input)) {
            error_response('No data provided', 400);
        }
        
        // Save data
        if (save_data_file($filename, $input)) {
            json_response(['success' => true, 'data' => $input]);
        } else {
            error_response('Failed to save data', 500);
        }
        break;
        
    case 'DELETE':
        check_auth(); // Ensure user is logged in
        
        // Handle specific item deletion if needed, or clear section
        // For now, we'll just clear the file content or reset to default
        if ($action === 'clear') {
            save_data_file($filename, []);
            json_response(['success' => true]);
        } else {
            error_response('Delete action not supported for this type', 400);
        }
        break;

    default:
        error_response('Method not allowed', 405);
}
?>
