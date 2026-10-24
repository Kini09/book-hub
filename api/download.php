<?php
/**
 * GET /api/download.php?book_id=1
 * Sends the PDF only if feedback for this book was just saved in this session.
 */

require_once __DIR__ . "/db.php";

$bookId = isset($_GET["book_id"]) ? (int) $_GET["book_id"] : 0;
$allowed = isset($_SESSION["allowed_downloads"][$bookId]) && $_SESSION["allowed_downloads"][$bookId];

if ($bookId < 1 || !$allowed) {
    http_response_code(403);
    header("Content-Type: text/plain; charset=utf-8");
    echo "Please submit the feedback form before downloading this PDF.";
    exit;
}

$stmt = $conn->prepare("SELECT title, author FROM books WHERE id = ?");
$stmt->bind_param("i", $bookId);
$stmt->execute();
$book = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$book) {
    http_response_code(404);
    echo "Book not found.";
    exit;
}

$title = $book["title"];
$author = $book["author"];
$safeTitle = preg_replace("/[()\\\\]/", "", $title);
$safeAuthor = preg_replace("/[()\\\\]/", "", $author);

$content = "BT\n"
    . "/F1 22 Tf\n"
    . "72 720 Td\n"
    . "(Book Hub) Tj\n"
    . "0 -36 Td\n"
    . "/F1 18 Tf\n"
    . "(" . $safeTitle . ") Tj\n"
    . "0 -28 Td\n"
    . "/F1 14 Tf\n"
    . "(by " . $safeAuthor . ") Tj\n"
    . "0 -48 Td\n"
    . "(Sample PDF for the Book Hub mini project.) Tj\n"
    . "0 -24 Td\n"
    . "(Download unlocked after feedback was saved.) Tj\n"
    . "ET";

$length = strlen($content);

$objects = [];
$objects[] = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
$objects[] = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
$objects[] = "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
    . "/Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n";
$objects[] = "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>\nendobj\n";
$objects[] = "5 0 obj\n<< /Length $length >>\nstream\n$content\nendstream\nendobj\n";

$pdf = "%PDF-1.4\n";
$offsets = [0];
foreach ($objects as $object) {
    $offsets[] = strlen($pdf);
    $pdf .= $object;
}

$xrefPos = strlen($pdf);
$pdf .= "xref\n0 6\n";
$pdf .= "0000000000 65535 f \n";
for ($i = 1; $i <= 5; $i++) {
    $pdf .= sprintf("%010d 00000 n \n", $offsets[$i]);
}
$pdf .= "trailer\n<< /Size 6 /Root 1 0 R >>\n";
$pdf .= "startxref\n" . $xrefPos . "\n%%EOF";

$fileName = preg_replace("/[^a-zA-Z0-9]+/", "-", strtolower($safeTitle)) . ".pdf";

header("Content-Type: application/pdf");
header("Content-Disposition: attachment; filename=\"" . $fileName . "\"");
header("Content-Length: " . strlen($pdf));
echo $pdf;
