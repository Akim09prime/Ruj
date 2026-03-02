<?php
// api/send_offer.php
require_once 'utils.php';

requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

$input = getJsonInput();
$to = $input['to'] ?? '';
$subject = $input['subject'] ?? '';
$message = $input['message'] ?? '';
$images = $input['images'] ?? []; // Array of filenames

if (empty($to) || empty($subject) || empty($message)) {
    errorResponse('Recipient, subject, and message are required');
}

// Sender info
$fromEmail = 'noreply@' . $_SERVER['HTTP_HOST'];
$fromName = 'Carvello Offers';
$headers = "From: $fromName <$fromEmail>\r\n";
$headers .= "Reply-To: $fromEmail\r\n";
$headers .= "MIME-Version: 1.0\r\n";

// Boundary for multipart
$boundary = md5(time());
$headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

// Message Body
$body = "--$boundary\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$body .= $message . "\r\n";

// Attachments
$attachmentsProcessed = 0;
foreach ($images as $img) {
    // Sanitize filename to prevent directory traversal
    $img = basename($img);
    $path = UPLOAD_DIR . $img;
    
    if (file_exists($path)) {
        $content = file_get_contents($path);
        if ($content !== false) {
            $encoded = chunk_split(base64_encode($content));
            $body .= "--$boundary\r\n";
            $body .= "Content-Type: application/octet-stream; name=\"$img\"\r\n";
            $body .= "Content-Description: $img\r\n";
            $body .= "Content-Disposition: attachment; filename=\"$img\"; size=" . filesize($path) . ";\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
            $body .= $encoded . "\r\n";
            $attachmentsProcessed++;
        }
    }
}

$body .= "--$boundary--";

// Send email
if (mail($to, $subject, $body, $headers)) {
    jsonResponse(['success' => true, 'message' => 'Email sent successfully', 'attachments_count' => $attachmentsProcessed]);
} else {
    // Log error if possible, but for now just return error
    errorResponse('Failed to send email. Please check server mail configuration.', 500);
}
?>
