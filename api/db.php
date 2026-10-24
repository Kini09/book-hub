<?php
/**
 * Database connection (MySQLi)
 * Change $pass if your XAMPP MySQL root user has a password.
 */

$host = "localhost";
$user = "root";
$pass = "";
$name = "book_hub";

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = new mysqli($host, $user, $pass, $name);
    $conn->set_charset("utf8mb4");
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    header("Content-Type: application/json");
    echo json_encode([
        "success" => false,
        "message" => "Could not connect to MySQL. Import sql/book_hub.sql and check api/db.php."
    ]);
    exit;
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
