# Book Hub

A mini library website for Web Programming: browse books, submit feedback, then download a sample PDF.

**Stack:** HTML5, CSS3, vanilla JavaScript, PHP, MySQL (XAMPP).

---

## 1. Folder structure

```
book-hub/
  index.html              Home: hero, search, featured books, add book
  books.html              Book grid + category filter + add book
  about.html              About + contact
  css/style.css           Layout, theme, responsive styles, live preview
  js/script.js            Search, cards, modals, validation, catalog sync, download
  api/db.php              MySQL connection + session
  api/books.php           GET books (prepared statements)
  api/add_book.php        POST new book to catalog (prepared statements)
  api/feedback.php        POST feedback, then allow download
  api/download.php        PDF only after feedback is saved
  sql/book_hub.sql        Tables + 22 curated books across 10 categories
  assets/covers/          SVG cover images
  README.md
```

---

## 2. Setup (XAMPP)

1. Install and open **XAMPP**. Start **Apache** and **MySQL**.
2. Copy this `book-hub` folder into `C:\xampp\htdocs\book-hub`.
   If you already opened it from `Projects\book-hub`, you can keep it there **only if** Apache can serve that folder. The simple student setup is `htdocs`.
3. Open **phpMyAdmin**: `http://localhost/phpmyadmin`
4. Click **Import** (or SQL) and run `sql/book_hub.sql`.
5. If your MySQL root password is not empty, edit `api/db.php` (`$pass`).
6. Open the site: `http://localhost/book-hub/`
   Do **not** open the HTML files with double-click (`file://`). PHP and fetch need a server.

Check the data: phpMyAdmin → `book_hub` → `books` (22 rows). You can also add custom books directly via the "+ Add Book" button on the website, which inserts into MySQL using prepared statements. After a download, `feedback` should get a new row.

---

## 3. How the download gate works

1. User clicks **Download** on a card.
2. A modal opens. Book title is filled automatically.
3. JavaScript checks name, email, rating, and comment.
4. `fetch` sends JSON to `api/feedback.php`.
5. PHP validates again, inserts with a **prepared statement**, and stores `$_SESSION["allowed_downloads"][book_id] = true`.
6. Only after a successful JSON response does JavaScript call `api/download.php?book_id=...`.
7. `download.php` refuses the file unless that session flag exists.

So the PDF does **not** start until feedback is saved.

---

## 4. Viva explanation (short)

- **Frontend** builds book cards from JSON. CSS Grid makes the layout responsive. The modal is hidden until Download is clicked.
- **Client validation** stops empty names, bad emails, missing stars, and short comments before the request is sent.
- **Server validation** repeats the checks so someone cannot skip JavaScript.
- **Prepared statements** (`bind_param`) send SQL and user data separately, which blocks SQL injection.
- **Session** is a server-side lock: download is allowed only after that browser session saved feedback for that book.
- **Sample PDFs** are generated in PHP so you do not need extra PDF libraries.

If asked “why PHP?”: it runs inside XAMPP with MySQL, no Node install, and `mysqli` prepared statements are a standard topic in this subject.
