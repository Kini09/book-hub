<?php
/**
 * POST /api/feedback.php
 * Saves feedback, then allows that book's PDF to be downloaded (session flag).
 * The browser must wait for this success response before calling download.php.
 */

require_once __DIR__ . "/db.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Use POST to submit feedback."]);
    exit;
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!is_array($data)) {
    $data = $_POST;
}

$name = isset($data["name"]) ? trim($data["name"]) : "";
$email = isset($data["email"]) ? trim($data["email"]) : "";
$comment = isset($data["comment"]) ? trim($data["comment"]) : "";
$rating = isset($data["rating"]) ? (int) $data["rating"] : 0;
$bookId = isset($data["book_id"]) ? (int) $data["book_id"] : 0;

$errors = [];

if (strlen($name) < 2) {
    $errors[] = "Please enter your name.";
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Please enter a valid email address.";
}

if ($rating < 1 || $rating > 5) {
    $errors[] = "Please choose a rating from 1 to 5 stars.";
}

if (strlen($comment) < 10) {
    $errors[] = "Feedback must be at least 10 characters.";
}

if ($bookId < 1) {
    $errors[] = "Missing book information.";
}

if ($errors) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => implode(" ", $errors)]);
    exit;
}

$check = $conn->prepare("SELECT id, title FROM books WHERE id = ?");
$check->bind_param("i", $bookId);
$check->execute();
$book = $check->get_result()->fetch_assoc();
$check->close();

if (!$book) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "That book was not found."]);
    exit;
}

$insert = $conn->prepare(
    "INSERT INTO feedback (name, email, rating, comment, book_id) VALUES (?, ?, ?, ?, ?)"
);
$insert->bind_param("ssisi", $name, $email, $rating, $comment, $bookId);
$insert->execute();
$insert->close();

if (!isset($_SESSION["allowed_downloads"]) || !is_array($_SESSION["allowed_downloads"])) {
    $_SESSION["allowed_downloads"] = [];
}

$_SESSION["allowed_downloads"][$bookId] = true;

echo json_encode([
    "success" => true,
    "message" => "Thank you! Your feedback was saved. Your download will start now.",
    "download_url" => "api/download.php?book_id=" . $bookId,
    "book_title" => $book["title"]
]);
