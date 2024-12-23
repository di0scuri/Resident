<?php
header("Content-Type: application/json");

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database credentials
$hostname = "lesterintheclouds.com";
$username = "IT112-24-M";
$password = "W2Bq@EV[SFEV";
$database = "db_brgy_app";

try {
    $conn = new mysqli($hostname, $username, $password, $database);

    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    // Fetch approved, open, and closed programs
    $sql = "SELECT programId AS id, programName AS title, location, startDate AS start, 
            endDate AS end, proposedBy AS participant, status
            FROM programs
            WHERE status IN ('Approved', 'Open', 'Closed')";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("SQL query failed: " . $conn->error);
    }

    $events = [];
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }

    // Check if events are empty
    if (empty($events)) {
        echo json_encode(["status" => "success", "data" => [], "message" => "No programs found for the specified statuses."]);
        exit();
    }

    echo json_encode(["status" => "success", "data" => $events]);
} catch (Exception $e) {
    // Debug exact error
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>
