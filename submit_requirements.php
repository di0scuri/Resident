<?php
header("Content-Type: application/json");

// Database configuration
$hostname = "lesterintheclouds.com";
$username = "IT112-24-M";
$password = "W2Bq@EV[SFEV";
$database = "db_brgy_app";

// Connect to the database
$conn = new mysqli($hostname, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$programId = $data['programId'] ?? null;
$residentId = $data['residentId'] ?? null;
$requirements = $data['requirements'] ?? [];

if (!$programId || !$residentId || empty($requirements)) {
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit();
}

$uploadDir = __DIR__ . "/uploads/$programId/$residentId";
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0777, true) && !is_dir($uploadDir)) {
        echo json_encode(["success" => false, "message" => "Failed to create upload directory."]);
        exit();
    }
}

try {
    $conn->begin_transaction();

    foreach ($requirements as $requirement) {
        $requirementId = $requirement['id'] ?? null;
        $file = $requirement['file'] ?? null;

        if (!$requirementId || !$file) {
            throw new Exception("Invalid requirement data.");
        }

        $filePath = "$uploadDir/" . basename($file['name']);
        if (!move_uploaded_file($file['tmp_name'], $filePath)) {
            throw new Exception("Failed to upload file for requirement ID $requirementId.");
        }

        $stmt = $conn->prepare("INSERT INTO resident_submissions (requirement_id, resident_id, program_id, file_path) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("iiis", $requirementId, $residentId, $programId, $filePath);
        $stmt->execute();
    }

    $conn->commit();
    echo json_encode(["success" => true, "message" => "Requirements submitted successfully."]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
} finally {
    $conn->close();
}
?>
