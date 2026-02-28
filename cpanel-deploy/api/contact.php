<?php
// api/contact.php
require_once 'utils.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $isMultipart = strpos($_SERVER['CONTENT_TYPE'] ?? '', 'multipart/form-data') !== false;
    
    if ($isMultipart) {
        $name = $_POST['name'] ?? '';
        $email = $_POST['email'] ?? '';
        $phone = $_POST['phone'] ?? '';
        $message = $_POST['message'] ?? '';
        $city = $_POST['city'] ?? '';
        $projectType = $_POST['projectType'] ?? '';
        $category = $_POST['category'] ?? '';
        $budget = $_POST['budget'] ?? '';
        $timeline = $_POST['timeline'] ?? '';
        $source = $_POST['source'] ?? '';
        $userAgent = $_POST['userAgent'] ?? '';
        $createdAt = $_POST['createdAt'] ?? date('c');
        $filePath = '';

        if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = UPLOAD_DIR;
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $fileName = uniqid() . '_' . basename($_FILES['file']['name']);
            $targetPath = $uploadDir . $fileName;
            
            if (move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
                $filePath = '/uploads/' . $fileName;
            }
        }
    } else {
        $input = getJsonInput();
        $name = $input['name'] ?? '';
        $email = $input['email'] ?? '';
        $phone = $input['phone'] ?? '';
        $message = $input['message'] ?? '';
        $city = $input['city'] ?? '';
        $projectType = $input['projectType'] ?? '';
        $category = $input['category'] ?? '';
        $budget = $input['budget'] ?? '';
        $timeline = $input['timeline'] ?? '';
        $filePath = $input['filePath'] ?? '';
        $source = $input['source'] ?? '';
        $userAgent = $input['userAgent'] ?? '';
        $createdAt = $input['createdAt'] ?? date('c');
    }

    if (!$name || !$email || !$phone) {
        errorResponse('Missing required fields');
    }

    $lead = [
        'id' => uniqid(),
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'city' => $city,
        'projectType' => $projectType,
        'category' => $category,
        'budget' => $budget,
        'timeline' => $timeline,
        'message' => $message,
        'filePath' => $filePath,
        'status' => 'new',
        'source' => $source,
        'userAgent' => $userAgent,
        'created_at' => $createdAt
    ];

    // 1. Save to JSON
    $leadsFile = DATA_DIR . 'leads.json';
    $leads = [];
    if (file_exists($leadsFile)) {
        $leads = json_decode(file_get_contents($leadsFile), true) ?? [];
    }
    
    array_unshift($leads, $lead);
    
    if (!file_put_contents($leadsFile, json_encode($leads, JSON_PRETTY_PRINT))) {
        errorResponse('Failed to save lead', 500);
    }

    // 2. Send Email
    $to = 'office@carvello.ro';
    $subject = "Lead Nou CARVELLO: $name ($projectType)";
    
    $emailBody = "Lead Nou de pe Site:\n\n";
    $emailBody .= "Nume: $name\n";
    $emailBody .= "Email: $email\n";
    $emailBody .= "Telefon: $phone\n";
    $emailBody .= "Oras: $city\n";
    $emailBody .= "Tip Proiect: $projectType\n";
    $emailBody .= "Mesaj:\n$message\n\n";
    if ($filePath) {
        $emailBody .= "Fisier atasat: " . $_SERVER['HTTP_HOST'] . $filePath . "\n";
    }
    $emailBody .= "Data: $createdAt\n";

    $headers = "From: no-reply@carvello.ro\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    $mailSent = mail($to, $subject, $emailBody, $headers);

    if ($mailSent) {
        jsonResponse(['ok' => true, 'message' => 'Solicitarea a fost trimisă cu succes.']);
    } else {
        // Lead saved but email failed
        jsonResponse(['ok' => true, 'message' => 'Solicitarea a fost salvată, dar notificarea email nu a putut fi trimisă momentan. Te vom contacta.']);
    }

} else {
    errorResponse('Method not allowed', 405);
}
?>
