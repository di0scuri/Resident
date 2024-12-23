<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database configuration
$hostname = "lesterintheclouds.com";
$username = "IT112-24-M";
$password = "W2Bq@EV[SFEV";
$database = "db_brgy_app";

// Establish database connection
$conn = new mysqli($hostname, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch programs with specified statuses
$statusArray = ['Approved', 'Open', 'Closed'];
$statusPlaceholder = implode(',', array_fill(0, count($statusArray), '?'));

// Prepare the SQL query
$sql = "SELECT 
            programId AS id, 
            programName AS name, 
            programType AS type, 
            location, 
            proposedBy, 
            committee, 
            startDate, 
            endDate, 
            budget, 
            note, 
            recipients, 
            status 
        FROM programs 
        WHERE status IN ($statusPlaceholder)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("SQL Error: " . $conn->error);
}

// Bind parameters dynamically
$stmt->bind_param(str_repeat('s', count($statusArray)), ...$statusArray);

// Execute the query
if (!$stmt->execute()) {
    die("Execution Error: " . $stmt->error);
}

$result = $stmt->get_result();

// Fetch the results
$programs = [];
while ($row = $result->fetch_assoc()) {
    $programs[] = $row;
}

// Close the statement and connection
$stmt->close();
$conn->close();

// Send JSON response
header('Content-Type: application/json');
echo json_encode($programs);
?>
