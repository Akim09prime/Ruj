<?php
// api/upload.php
require_once 'utils.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAuth();

    if (!isset($_FILES['file'])) {
        errorResponse('No file uploaded');
    }

    $file = $_FILES['file'];
    
    if ($file['error'] !== UPLOAD_ERR_OK) {
        errorResponse('Upload failed with error code ' . $file['error']);
    }

    // Validate mime type
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);
    $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'video/mp4', 'video/webm', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!in_array($mime, $allowedMimes)) {
        errorResponse('Invalid file type');
    }

    // Generate unique name
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '.' . $ext;
    $targetPath = UPLOAD_DIR . $filename;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        // Return public URL path
        // Assuming api is at /api and uploads at /uploads
        $url = '/uploads/' . $filename;
        jsonResponse(['success' => true, 'url' => $url]);
    } else {
        errorResponse('Failed to move uploaded file', 500);
    }
} else {
    errorResponse('Method not allowed', 405);
}
?>
