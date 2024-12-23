<?php
header("Content-Type: application/json");

// Database configuration
$hostname = "lesterintheclouds.com";
$username = "IT112-24-M";
$password = "W2Bq@EV[SFEV";
$database = "db_brgy_app";

try {
    // Connect to the database
    $conn = new mysqli($hostname, $username, $password, $database);

    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    // Check for program_id in the request
    $programId = isset($_GET['program_id']) ? intval($_GET['program_id']) : null;
    if (!$programId) {
        throw new Exception("Program ID is required.");
    }

    // Fetch requirements for the given program ID
    $stmt = $conn->prepare("SELECT id, name FROM requirements WHERE program_id = ?");
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }

    $stmt->bind_param("i", $programId);
    $stmt->execute();
    $result = $stmt->get_result();

    if (!$result) {
        throw new Exception("Failed to execute query: " . $conn->error);
    }

    $requirements = [];
    while ($row = $result->fetch_assoc()) {
        $requirements[] = $row;
    }

    if (empty($requirements)) {
        echo json_encode(["success" => false, "message" => "No requirements found for the given program ID."]);
    } else {
        echo json_encode(["success" => true, "data" => $requirements]);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
