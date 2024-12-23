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

$programId = $_GET['programId'] ?? null;
$residentId = $_GET['residentId'] ?? null;

if (!$programId || !$residentId) {
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit();
}

try {
    $stmt = $conn->prepare("SELECT COUNT(*) AS count FROM resident_submissions WHERE program_id = ? AND resident_id = ?");
    $stmt->bind_param("ii", $programId, $residentId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result) {
        $row = $result->fetch_assoc();
        $hasSubmitted = $row['count'] > 0;
        echo json_encode(["success" => true, "hasSubmitted" => $hasSubmitted]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to fetch submission status."]);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
} finally {
    $conn->close();
}
?>
