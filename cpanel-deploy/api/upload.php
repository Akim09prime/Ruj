<?php
require_once 'utils.php';

// Ensure user is logged in
check_auth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_response('Method not allowed', 405);
}

if (!isset($_FILES['file'])) {
    error_response('No file uploaded', 400);
}

$file = $_FILES['file'];
$upload_dir = UPLOAD_DIR;
$upload_url = UPLOAD_URL;

// Validate file type
$allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'];
if (!in_array($file['type'], $allowed_types)) {
    error_response('Invalid file type. Allowed: JPG, PNG, WEBP, GIF, MP4, WEBM, MOV', 400);
}

// Validate file size (max 50MB for videos)
if ($file['size'] > 50 * 1024 * 1024) {
    error_response('File too large. Max 50MB', 400);
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid() . '.' . $extension;
$target_path = $upload_dir . $filename;

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $target_path)) {
    json_response([
        'success' => true,
        'url' => $upload_url . $filename,
        'filename' => $filename
    ]);
} else {
    error_response('Failed to upload file', 500);
}
?>
