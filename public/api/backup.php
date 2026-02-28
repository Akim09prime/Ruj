<?php
// api/backup.php
require_once 'utils.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'export') {
    requireAuth();
    
    // Create a zip of the data directory
    $zip = new ZipArchive();
    $filename = 'backup_' . date('Y-m-d_H-i-s') . '.zip';
    $filepath = UPLOAD_DIR . $filename;
    
    if ($zip->open($filepath, ZipArchive::CREATE) !== TRUE) {
        errorResponse('Cannot create backup zip', 500);
    }
    
    $files = glob(DATA_DIR . '*.json');
    foreach ($files as $file) {
        $zip->addFile($file, basename($file));
    }
    
    $zip->close();
    
    jsonResponse(['success' => true, 'file' => '/uploads/' . $filename]);
} else {
    errorResponse('Invalid action or method');
}
?>
