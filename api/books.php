<?php
/**
 * GET /api/books.php
 * Optional query: ?category=Fiction  ?q=wells
 * Returns JSON list of books from MySQL (prepared statements).
 */

require_once __DIR__ . "/db.php";

header("Content-Type: application/json");

$category = isset($_GET["category"]) ? trim($_GET["category"]) : "";
$search = isset($_GET["q"]) ? trim($_GET["q"]) : "";

$sql = "SELECT id, title, author, category, cover_image, pdf_path FROM books WHERE 1=1";
$types = "";
$params = [];

if ($category !== "" && strtolower($category) !== "all") {
    $sql .= " AND category = ?";
    $types .= "s";
    $params[] = $category;
}

if ($search !== "") {
    $sql .= " AND (title LIKE ? OR author LIKE ?)";
    $types .= "ss";
    $like = "%" . $search . "%";
    $params[] = $like;
    $params[] = $like;
}

$sql .= " ORDER BY title ASC";

$stmt = $conn->prepare($sql);

if ($types !== "") {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();
$books = $result->fetch_all(MYSQLI_ASSOC);
$stmt->close();

echo json_encode([
    "success" => true,
    "books" => $books
]);
