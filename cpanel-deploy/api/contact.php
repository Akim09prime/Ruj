<?php
// api/contact.php
require_once 'utils.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

// 1. Parse Input
$input = [];
$isMultipart = strpos($_SERVER['CONTENT_TYPE'] ?? '', 'multipart/form-data') !== false;

if ($isMultipart) {
    // Handle form-data
    $fields = ['name', 'email', 'phone', 'message', 'city', 'projectType', 'category', 'budget', 'timeline', 'source', 'userAgent', 'createdAt'];
    foreach ($fields as $field) {
        $input[$field] = $_POST[$field] ?? '';
    }
    
    // Handle File Upload
    $input['filePath'] = '';
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['file'];
        
        // Validation
        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        $maxSize = 10 * 1024 * 1024; // 10MB

        if (!in_array($file['type'], $allowedTypes)) {
            errorResponse('Tipul de fișier nu este permis. Sunt acceptate doar imagini (JPG, PNG, WEBP) și documente (PDF, DOC, DOCX).');
        }

        if ($file['size'] > $maxSize) {
            errorResponse('Fișierul este prea mare. Limita maximă este de 10MB.');
        }

        // Safe filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $safeName = uniqid('lead_') . '_' . preg_replace('/[^a-zA-Z0-9]/', '', pathinfo($file['name'], PATHINFO_FILENAME)) . '.' . $extension;
        $targetPath = UPLOAD_DIR . $safeName;
        
        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $input['filePath'] = '/uploads/' . $safeName;
        } else {
            errorResponse('Eroare la încărcarea fișierului. Vă rugăm să încercați din nou.');
        }
    } elseif (isset($_FILES['file']) && $_FILES['file']['error'] !== UPLOAD_ERR_NO_FILE) {
        errorResponse('A apărut o eroare la transferul fișierului: ' . $_FILES['file']['error']);
    }
} else {
    // Handle JSON
    $input = getJsonInput();
}

// 2. Validate
if (empty($input['name']) || empty($input['email']) || empty($input['phone'])) {
    errorResponse('Missing required fields: name, email, phone');
}

// 3. Create Lead Object
$lead = [
    'id' => uniqid(),
    'type' => 'general', // Default type
    'name' => $input['name'] ?? '',
    'email' => $input['email'] ?? '',
    'phone' => $input['phone'] ?? '',
    'city' => $input['city'] ?? '',
    'projectType' => $input['projectType'] ?? '',
    'category' => $input['category'] ?? '',
    'budget' => $input['budget'] ?? '',
    'timeline' => $input['timeline'] ?? '',
    'message' => $input['message'] ?? '',
    'filePath' => $input['filePath'] ?? '',
    'status' => 'new',
    'source' => $input['source'] ?? 'website',
    'userAgent' => $input['userAgent'] ?? $_SERVER['HTTP_USER_AGENT'] ?? '',
    'createdAt' => $input['createdAt'] ?? date('c')
];

// 4. Save to Database (JSON)
$leadsFile = DATA_DIR . 'leads.json';
$leads = [];

if (file_exists($leadsFile)) {
    $content = file_get_contents($leadsFile);
    $leads = json_decode($content, true) ?? [];
}

array_unshift($leads, $lead);

if (!file_put_contents($leadsFile, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    errorResponse('Internal Server Error: Could not save lead.', 500);
}

// 5. Send Email Notification
$to = 'office@carvello.ro';
$subject = "Lead Nou CARVELLO: {$lead['name']} ({$lead['projectType']})";

$body = "Un nou lead a fost înregistrat pe site:\n\n";
$body .= "Nume: {$lead['name']}\n";
$body .= "Email: {$lead['email']}\n";
$body .= "Telefon: {$lead['phone']}\n";
$body .= "Oraș: {$lead['city']}\n";
$body .= "Tip Proiect: {$lead['projectType']}\n";
$body .= "Categorie: {$lead['category']}\n";
$body .= "Buget: {$lead['budget']}\n";
$body .= "Termen: {$lead['timeline']}\n";
$body .= "Mesaj:\n{$lead['message']}\n\n";

if ($lead['filePath']) {
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
    $fullUrl = $protocol . $_SERVER['HTTP_HOST'] . $lead['filePath'];
    $body .= "Fișier atașat: $fullUrl\n";
}

$body .= "Data: " . date('d.m.Y H:i', strtotime($lead['createdAt'])) . "\n";
$body .= "Sursa: {$lead['source']}\n";

$headers = [
    'From' => 'no-reply@carvello.ro',
    'Reply-To' => $lead['email'],
    'X-Mailer' => 'PHP/' . phpversion(),
    'Content-Type' => 'text/plain; charset=UTF-8'
];

// Convert headers array to string
$headersString = '';
foreach ($headers as $key => $value) {
    $headersString .= "$key: $value\r\n";
}

$mailSent = mail($to, $subject, $body, $headersString);

// 6. Return Response
if ($mailSent) {
    jsonResponse(['ok' => true, 'message' => 'Solicitarea a fost trimisă cu succes.']);
} else {
    // Lead saved, email failed
    jsonResponse([
        'ok' => true, 
        'message' => 'Solicitarea a fost salvată, dar notificarea email nu a putut fi trimisă momentan. Echipa noastră va verifica manual solicitarea.'
    ]);
}
?>
