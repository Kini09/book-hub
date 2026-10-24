<?php
/**
 * POST /api/add_book.php
 * Adds a new book to the catalog using prepared statements.
 */

require_once __DIR__ . "/db.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed."
    ]);
    exit;
}

$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

if (!is_array($data)) {
    $data = $_POST;
}

$title = isset($data["title"]) ? trim($data["title"]) : "";
$author = isset($data["author"]) ? trim($data["author"]) : "";
$category = isset($data["category"]) ? trim($data["category"]) : "";
$coverColor = isset($data["cover_color"]) ? trim($data["cover_color"]) : "#1F3A5F";
$customCover = isset($data["cover_image"]) ? trim($data["cover_image"]) : "";

$errors = [];

if (mb_strlen($title) < 2 || mb_strlen($title) > 150) {
    $errors[] = "Title must be between 2 and 150 characters.";
}

if (mb_strlen($author) < 2 || mb_strlen($author) > 120) {
    $errors[] = "Author must be between 2 and 120 characters.";
}

if (mb_strlen($category) < 2 || mb_strlen($category) > 50) {
    $errors[] = "Category must be between 2 and 50 characters.";
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        "success" => false,
        "message" => implode(" ", $errors)
    ]);
    exit;
}

// Generate cover if not specified
$slug = preg_replace("/[^a-z0-9]+/i", "-", strtolower($title));
$slug = trim($slug, "-");
if ($slug === "") {
    $slug = "custom-book-" . time();
}

$coverPath = $customCover;
if ($coverPath === "") {
    // Generate an SVG cover
    $coverFilename = $slug . ".svg";
    $coversDir = dirname(__DIR__) . "/assets/covers";
    if (!is_dir($coversDir)) {
        @mkdir($coversDir, 0777, true);
    }
    
    // Choose nice contrast text / border color
    $strokeColor = "#E8D5A3";
    $safeTitle = htmlspecialchars($title, ENT_QUOTES | ENT_XML1, "UTF-8");
    $safeAuthor = htmlspecialchars($author, ENT_QUOTES | ENT_XML1, "UTF-8");
    $safeColor = preg_match("/^#[0-9a-fA-F]{3,8}$/", $coverColor) ? $coverColor : "#1F3A5F";

    $svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">' . "\n"
        . '  <rect width="400" height="600" fill="' . $safeColor . '"/>' . "\n"
        . '  <rect x="22" y="22" width="356" height="556" fill="none" stroke="' . $strokeColor . '" stroke-width="3"/>' . "\n"
        . '  <text x="200" y="280" fill="#F7F3EA" font-family="Georgia, serif" font-size="28" font-weight="bold" text-anchor="middle">' . $safeTitle . '</text>' . "\n"
        . '  <text x="200" y="370" fill="' . $strokeColor . '" font-family="Georgia, serif" font-size="16" text-anchor="middle">' . $safeAuthor . '</text>' . "\n"
        . '</svg>' . "\n";

    $coverFilePath = $coversDir . "/" . $coverFilename;
    @file_put_contents($coverFilePath, $svgContent);
    $coverPath = "assets/covers/" . $coverFilename;
}

$pdfPath = $slug . ".pdf";

$stmt = $conn->prepare("INSERT INTO books (title, author, category, cover_image, pdf_path) VALUES (?, ?, ?, ?, ?)");
if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error preparing query: " . $conn->error
    ]);
    exit;
}

$stmt->bind_param("sssss", $title, $author, $category, $coverPath, $pdfPath);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to insert book: " . $stmt->error
    ]);
    $stmt->close();
    exit;
}

$newId = $stmt->insert_id;
$stmt->close();

echo json_encode([
    "success" => true,
    "message" => "Book added to catalog successfully!",
    "book" => [
        "id" => $newId,
        "title" => $title,
        "author" => $author,
        "category" => $category,
        "cover_image" => $coverPath,
        "pdf_path" => $pdfPath
    ]
]);
