<?php
require_once 'utils.php';

// Ensure user is logged in
check_auth();

$action = $_GET['action'] ?? 'export';

switch ($action) {
    case 'export':
        // Get all data files
        $data = [];
        $files = glob(DATA_DIR . '*.json');
        foreach ($files as $file) {
            $filename = basename($file, '.json');
            $content = json_decode(file_get_contents($file), true);
            $data[$filename] = $content;
        }
        
        // Return as JSON download
        header('Content-Type: application/json');
        header('Content-Disposition: attachment; filename="backup_' . date('Y-m-d_H-i-s') . '.json"');
        echo json_encode($data, JSON_PRETTY_PRINT);
        exit();
        break;
        
    case 'import':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            error_response('Method not allowed', 405);
        }
        
        $input = get_json_input();
        
        if (empty($input)) {
            error_response('No data provided', 400);
        }
        
        // Validate input structure (basic check)
        if (!is_array($input)) {
            error_response('Invalid data format', 400);
        }
        
        // Save each section
        foreach ($input as $filename => $content) {
            // Sanitize filename to prevent directory traversal
            $filename = sanitize_filename($filename);
            
            // Skip auth file to prevent overwriting admin credentials
            if ($filename === 'auth') {
                continue;
            }
            
            save_data_file($filename, $content);
        }
        
        json_response(['success' => true]);
        break;
        
    case 'reset':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            error_response('Method not allowed', 405);
        }
        
        // Clear all data files except auth
        $files = glob(DATA_DIR . '*.json');
        foreach ($files as $file) {
            $filename = basename($file, '.json');
            if ($filename !== 'auth') {
                unlink($file);
            }
        }
        
        json_response(['success' => true]);
        break;
        
    default:
        error_response('Invalid action', 400);
}
?>
