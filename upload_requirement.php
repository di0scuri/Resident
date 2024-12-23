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

$residentId = $_POST['resident_id'] ?? null;
$requirementId = $_POST['requirement_id'] ?? null;
$programId = $_POST['program_id'] ?? null;
$file = $_FILES['file'] ?? null;

if (!$residentId || !$requirementId || !$programId || !$file) {
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit();
}

// File upload directory
$uploadDir = "uploads/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$targetFile = $uploadDir . basename($file['name']);
if (move_uploaded_file($file['tmp_name'], $targetFile)) {
    $stmt = $conn->prepare("INSERT INTO resident_submissions (requirement_id, resident_id, file_path) VALUES (?, ?, ?)");
    $stmt->bind_param("iis", $requirementId, $residentId, $targetFile);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "filePath" => $targetFile, "message" => "File uploaded successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to save file information to database."]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Failed to upload file."]);
}

$conn->close();
?>
