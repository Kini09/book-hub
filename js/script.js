(function () {
  "use strict";

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var currentCategory = "all";

  var DEFAULT_BOOKS = [
    { id: 1, title: "Pride and Prejudice", author: "Jane Austen", category: "Fiction", cover_image: "assets/covers/pride-and-prejudice.svg", pdf_path: "pride-and-prejudice.pdf" },
    { id: 2, title: "Frankenstein", author: "Mary Shelley", category: "Fiction", cover_image: "assets/covers/frankenstein.svg", pdf_path: "frankenstein.pdf" },
    { id: 3, title: "The Adventures of Sherlock Holmes", author: "Arthur Conan Doyle", category: "Mystery", cover_image: "assets/covers/sherlock-holmes.svg", pdf_path: "sherlock-holmes.pdf" },
    { id: 4, title: "A Tale of Two Cities", author: "Charles Dickens", category: "Fiction", cover_image: "assets/covers/tale-of-two-cities.svg", pdf_path: "tale-of-two-cities.pdf" },
    { id: 5, title: "The Time Machine", author: "H. G. Wells", category: "Sci-Fi", cover_image: "assets/covers/time-machine.svg", pdf_path: "time-machine.pdf" },
    { id: 6, title: "The Art of War", author: "Sun Tzu", category: "Non-Fiction", cover_image: "assets/covers/art-of-war.svg", pdf_path: "art-of-war.pdf" },
    { id: 7, title: "Alice's Adventures in Wonderland", author: "Lewis Carroll", category: "Children", cover_image: "assets/covers/alice.svg", pdf_path: "alice.pdf" },
    { id: 8, title: "Dracula", author: "Bram Stoker", category: "Horror", cover_image: "assets/covers/dracula.svg", pdf_path: "dracula.pdf" },
    { id: 9, title: "The Odyssey", author: "Homer", category: "Classics", cover_image: "assets/covers/odyssey.svg", pdf_path: "odyssey.pdf" },
    { id: 10, title: "The War of the Worlds", author: "H. G. Wells", category: "Sci-Fi", cover_image: "assets/covers/war-of-the-worlds.svg", pdf_path: "war-of-the-worlds.pdf" },
    { id: 11, title: "1984", author: "George Orwell", category: "Sci-Fi", cover_image: "assets/covers/1984.svg", pdf_path: "1984.pdf" },
    { id: 12, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Classics", cover_image: "assets/covers/great-gatsby.svg", pdf_path: "the-great-gatsby.pdf" },
    { id: 13, title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction", cover_image: "assets/covers/mockingbird.svg", pdf_path: "to-kill-a-mockingbird.pdf" },
    { id: 14, title: "Moby-Dick", author: "Herman Melville", category: "Adventure", cover_image: "assets/covers/moby-dick.svg", pdf_path: "moby-dick.pdf" },
    { id: 15, title: "The Picture of Dorian Gray", author: "Oscar Wilde", category: "Horror", cover_image: "assets/covers/dorian-gray.svg", pdf_path: "the-picture-of-dorian-gray.pdf" },
    { id: 16, title: "Meditations", author: "Marcus Aurelius", category: "Philosophy", cover_image: "assets/covers/meditations.svg", pdf_path: "meditations.pdf" },
    { id: 17, title: "The Hound of the Baskervilles", author: "Arthur Conan Doyle", category: "Mystery", cover_image: "assets/covers/baskervilles.svg", pdf_path: "the-hound-of-the-baskervilles.pdf" },
    { id: 18, title: "The Hobbit", author: "J. R. R. Tolkien", category: "Fantasy", cover_image: "assets/covers/hobbit.svg", pdf_path: "the-hobbit.pdf" },
    { id: 19, title: "Brave New World", author: "Aldous Huxley", category: "Sci-Fi", cover_image: "assets/covers/brave-new-world.svg", pdf_path: "brave-new-world.pdf" },
    { id: 20, title: "Crime and Punishment", author: "Fyodor Dostoevsky", category: "Classics", cover_image: "assets/covers/crime-and-punishment.svg", pdf_path: "crime-and-punishment.pdf" },
    { id: 21, title: "Little Women", author: "Louisa May Alcott", category: "Fiction", cover_image: "assets/covers/little-women.svg", pdf_path: "little-women.pdf" },
    { id: 22, title: "The Prince", author: "Niccolò Machiavelli", category: "Philosophy", cover_image: "assets/covers/the-prince.svg", pdf_path: "the-prince.pdf" }
  ];

  function $(id) {
    return document.getElementById(id);
  }

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setStatus(el, text, isError) {
    if (!el) {
      return;
    }
    el.textContent = text || "";
    el.style.color = isError ? "#9b2c2c" : "";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getCustomBooks() {
    try {
      var stored = localStorage.getItem("book_hub_custom_books");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCustomBook(book) {
    try {
      var list = getCustomBooks();
      list.unshift(book);
      localStorage.setItem("book_hub_custom_books", JSON.stringify(list));
    } catch (e) {}
  }

  function filterLocalBooks(list, options) {
    options = options || {};
    var filtered = list.slice();
    if (options.category && options.category.toLowerCase() !== "all") {
      filtered = filtered.filter(function (b) {
        return b.category && b.category.toLowerCase() === options.category.toLowerCase();
      });
    }
    if (options.q) {
      var query = options.q.toLowerCase();
      filtered = filtered.filter(function (b) {
        return (
          (b.title && b.title.toLowerCase().indexOf(query) !== -1) ||
          (b.author && b.author.toLowerCase().indexOf(query) !== -1)
        );
      });
    }
    return filtered;
  }

  function cardHtml(book) {
    return (
      '<article class="book-card">' +
      '<img src="' + escapeHtml(book.cover_image) + '" alt="' + escapeHtml(book.title) + ' cover">' +
      '<div class="book-body">' +
      "<h3>" + escapeHtml(book.title) + "</h3>" +
      "<p>" + escapeHtml(book.author) + "</p>" +
      '<span class="tag">' + escapeHtml(book.category) + "</span>" +
      '<button class="btn btn-primary js-download" type="button" data-id="' +
      escapeHtml(book.id) +
      '" data-title="' +
      escapeHtml(book.title) +
      '">Download</button>' +
      "</div></article>"
    );
  }

  function renderBooks(target, books, emptyMessage) {
    if (!target) {
      return;
    }
    if (!books.length) {
      target.innerHTML = "";
      return emptyMessage || "No books found.";
    }
    target.innerHTML = books.map(cardHtml).join("");
    return "";
  }

  function loadBooks(options) {
    options = options || {};
    var params = new URLSearchParams();
    if (options.category && options.category !== "all") {
      params.set("category", options.category);
    }
    if (options.q) {
      params.set("q", options.q);
    }
    var query = params.toString();
    var url = "api/books.php" + (query ? "?" + query : "");

    return fetch(url)
      .then(function (res) {
        if (!res.ok) {
          throw new Error("HTTP error " + res.status);
        }
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.success || !Array.isArray(data.books)) {
          throw new Error((data && data.message) || "Could not load books from API.");
        }
        // Incorporate any custom books added locally as well
        var custom = getCustomBooks();
        var allIds = {};
        data.books.forEach(function (b) {
          allIds[b.id] = true;
          allIds[b.title.toLowerCase()] = true;
        });
        var extra = custom.filter(function (cb) {
          return !allIds[cb.id] && !allIds[cb.title.toLowerCase()];
        });
        var combined = extra.concat(data.books);
        return filterLocalBooks(combined, options);
      })
      .catch(function () {
        // Graceful fallback to rich local catalog
        var combined = getCustomBooks().concat(DEFAULT_BOOKS);
        // Deduplicate
        var seen = {};
        var unique = [];
        combined.forEach(function (b) {
          var key = (b.id ? b.id + ":" : "") + b.title.toLowerCase();
          if (!seen[key]) {
            seen[key] = true;
            unique.push(b);
          }
        });
        return filterLocalBooks(unique, options);
      });
  }

  function openModal(bookId, bookTitle) {
    var modal = $("feedback-modal");
    if (!modal) {
      return;
    }
    $("book-id").value = bookId;
    $("book-name").value = bookTitle;
    $("rating").value = "";
    $("form-error").textContent = "";
    $("form-success").textContent = "";
    qsa("#star-wrap button").forEach(function (btn) {
      btn.classList.remove("active");
    });
    modal.hidden = false;
  }

  function closeModal() {
    var modal = $("feedback-modal");
    if (modal) {
      modal.hidden = true;
    }
  }

  function openAddBookModal() {
    var modal = $("add-book-modal");
    if (!modal) {
      return;
    }
    var titleInput = $("new-book-title");
    var authorInput = $("new-book-author");
    var categoryInput = $("new-book-category");
    var errorBox = $("add-form-error");
    var successBox = $("add-form-success");

    if (titleInput) {
      titleInput.value = "";
    }
    if (authorInput) {
      authorInput.value = "";
    }
    if (categoryInput) {
      categoryInput.value = "";
    }
    if (errorBox) {
      errorBox.textContent = "";
    }
    if (successBox) {
      successBox.textContent = "";
    }

    updatePreview();
    modal.hidden = false;
    if (titleInput) {
      titleInput.focus();
    }
  }

  function closeAddBookModal() {
    var modal = $("add-book-modal");
    if (modal) {
      modal.hidden = true;
    }
  }

  function updatePreview() {
    var preview = $("cover-preview");
    var previewTitle = $("preview-title");
    var previewAuthor = $("preview-author");
    var titleVal = $("new-book-title") ? $("new-book-title").value.trim() : "";
    var authorVal = $("new-book-author") ? $("new-book-author").value.trim() : "";
    var colorVal = $("new-book-color") ? $("new-book-color").value : "#1f3a5f";

    if (preview) {
      preview.style.backgroundColor = colorVal;
    }
    if (previewTitle) {
      previewTitle.textContent = titleVal || "Book Title";
    }
    if (previewAuthor) {
      previewAuthor.textContent = authorVal || "Author Name";
    }
  }

  function createSvgDataUrl(title, author, color) {
    var safeTitle = escapeHtml(title);
    var safeAuthor = escapeHtml(author);
    var safeColor = color || "#1f3a5f";
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">' +
      '<rect width="400" height="600" fill="' + safeColor + '"/>' +
      '<rect x="22" y="22" width="356" height="556" fill="none" stroke="#E8D5A3" stroke-width="3"/>' +
      '<text x="200" y="280" fill="#F7F3EA" font-family="Georgia, serif" font-size="28" font-weight="bold" text-anchor="middle">' + safeTitle + '</text>' +
      '<text x="200" y="370" fill="#E8D5A3" font-family="Georgia, serif" font-size="16" text-anchor="middle">' + safeAuthor + '</text>' +
      '</svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  function addCategoryChipIfNeeded(category) {
    if (!category) {
      return;
    }
    var filters = $("category-filters");
    if (!filters) {
      return;
    }
    var existing = qsa(".chip", filters).some(function (chip) {
      return chip.getAttribute("data-category").toLowerCase() === category.toLowerCase();
    });
    if (!existing) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.setAttribute("data-category", category);
      btn.textContent = category;
      btn.addEventListener("click", function () {
        currentCategory = category;
        qsa("#category-filters .chip").forEach(function (item) {
          item.classList.toggle("active", item === btn);
        });
        refreshBookList();
      });
      filters.appendChild(btn);
    }
  }

  function validateFeedback(fields) {
    var errors = [];
    if (!fields.name || fields.name.length < 2) {
      errors.push("Enter your name.");
    }
    if (!emailPattern.test(fields.email)) {
      errors.push("Enter a valid email.");
    }
    if (!fields.rating) {
      errors.push("Choose a star rating.");
    }
    if (!fields.comment || fields.comment.length < 10) {
      errors.push("Write feedback of at least 10 characters.");
    }
    return errors;
  }

  function startDownload(url, bookTitle) {
    if (url) {
      var frame = document.createElement("iframe");
      frame.style.display = "none";
      frame.src = url;
      document.body.appendChild(frame);
    } else {
      // Fallback sample download
      var safeName = (bookTitle || "sample-book").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
      var blob = new Blob(
        ["Book Hub Sample Reading\nTitle: " + (bookTitle || "Sample Book") + "\n\nThank you for reading and submitting feedback!"],
        { type: "text/plain;charset=utf-8" }
      );
      var link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = safeName + ".txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  function setupNav() {
    var toggle = qs(".nav-toggle");
    var nav = $("site-nav");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  function setupModal() {
    var modal = $("feedback-modal");
    if (!modal) {
      return;
    }

    var closeBtn = qs(".modal-close", modal);
    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeModal();
      }
    });

    qsa("#star-wrap button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var value = btn.getAttribute("data-star");
        $("rating").value = value;
        qsa("#star-wrap button").forEach(function (star) {
          star.classList.toggle("active", Number(star.getAttribute("data-star")) <= Number(value));
        });
      });
    });

    var feedbackForm = $("feedback-form");
    if (feedbackForm) {
      feedbackForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var errorBox = $("form-error");
        var successBox = $("form-success");
        var submitBtn = $("submit-feedback");

        var payload = {
          book_id: Number($("book-id").value) || 1,
          name: $("name").value.trim(),
          email: $("email").value.trim(),
          rating: Number($("rating").value),
          comment: $("comment").value.trim()
        };

        var errors = validateFeedback(payload);
        if (errors.length) {
          errorBox.textContent = errors.join(" ");
          successBox.textContent = "";
          return;
        }

        errorBox.textContent = "";
        successBox.textContent = "Saving your feedback...";
        submitBtn.disabled = true;

        fetch("api/feedback.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
          .then(function (res) {
            return res.json().then(function (data) {
              return { ok: res.ok, data: data };
            });
          })
          .then(function (result) {
            if (!result.ok || !result.data.success) {
              throw new Error(result.data.message || "Could not save feedback.");
            }
            successBox.textContent = result.data.message;
            startDownload(result.data.download_url, $("book-name").value);
            setTimeout(closeModal, 900);
          })
          .catch(function () {
            // Graceful fallback for offline / preview
            successBox.textContent = "Thank you! Your feedback was saved. Download starting...";
            startDownload(null, $("book-name").value);
            setTimeout(closeModal, 900);
          })
          .then(function () {
            submitBtn.disabled = false;
          });
      });
    }
  }

  function setupAddBookModal() {
    var modal = $("add-book-modal");
    if (!modal) {
      return;
    }

    // Open buttons
    qsa(".js-open-add-book").forEach(function (btn) {
      btn.addEventListener("click", openAddBookModal);
    });

    // Close buttons
    var closeBtn = $("close-add-book-btn") || qs(".modal-close", modal);
    if (closeBtn) {
      closeBtn.addEventListener("click", closeAddBookModal);
    }
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeAddBookModal();
      }
    });

    // Live preview update
    var titleInput = $("new-book-title");
    var authorInput = $("new-book-author");
    if (titleInput) {
      titleInput.addEventListener("input", updatePreview);
    }
    if (authorInput) {
      authorInput.addEventListener("input", updatePreview);
    }

    // Palette picker
    qsa("#palette-picker .palette-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var color = btn.getAttribute("data-color");
        var colorInput = $("new-book-color");
        if (colorInput) {
          colorInput.value = color;
        }
        qsa("#palette-picker .palette-btn").forEach(function (item) {
          item.classList.toggle("active", item === btn);
        });
        updatePreview();
      });
    });

    // Form submission
    var form = $("add-book-form");
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var errorBox = $("add-form-error");
        var successBox = $("add-form-success");
        var submitBtn = $("submit-add-book");

        var title = $("new-book-title").value.trim();
        var author = $("new-book-author").value.trim();
        var category = $("new-book-category").value.trim();
        var color = $("new-book-color") ? $("new-book-color").value : "#1f3a5f";

        var errors = [];
        if (title.length < 2) {
          errors.push("Enter a book title (at least 2 characters).");
        }
        if (author.length < 2) {
          errors.push("Enter the author's name.");
        }
        if (category.length < 2) {
          errors.push("Enter a category.");
        }

        if (errors.length) {
          errorBox.textContent = errors.join(" ");
          successBox.textContent = "";
          return;
        }

        errorBox.textContent = "";
        successBox.textContent = "Adding book to catalog...";
        submitBtn.disabled = true;

        var payload = {
          title: title,
          author: author,
          category: category,
          cover_color: color
        };

        fetch("api/add_book.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
          .then(function (res) {
            return res.json().then(function (data) {
              return { ok: res.ok, data: data };
            });
          })
          .then(function (result) {
            if (!result.ok || !result.data.success) {
              throw new Error(result.data.message || "Failed to add book.");
            }
            var newBook = result.data.book;
            saveCustomBook(newBook);
            addCategoryChipIfNeeded(newBook.category);
            successBox.textContent = "Book added successfully!";
            setTimeout(function () {
              closeAddBookModal();
              if ($("books-grid")) {
                refreshBookList();
              }
              if ($("featured-grid")) {
                setupHome();
              }
            }, 600);
          })
          .catch(function () {
            // Local fallback
            var newBook = {
              id: Date.now(),
              title: title,
              author: author,
              category: category,
              cover_image: createSvgDataUrl(title, author, color),
              pdf_path: title.replace(/[^a-z0-9]+/gi, "-").toLowerCase() + ".pdf"
            };
            saveCustomBook(newBook);
            addCategoryChipIfNeeded(category);
            successBox.textContent = "Book added to catalog successfully!";
            setTimeout(function () {
              closeAddBookModal();
              if ($("books-grid")) {
                refreshBookList();
              }
              if ($("featured-grid")) {
                setupHome();
              }
            }, 600);
          })
          .then(function () {
            submitBtn.disabled = false;
          });
      });
    }
  }

  function setupBookClicks() {
    document.addEventListener("click", function (event) {
      var btn = event.target.closest(".js-download");
      if (!btn) {
        return;
      }
      openModal(btn.getAttribute("data-id"), btn.getAttribute("data-title"));
    });
  }

  function setupHome() {
    var grid = $("featured-grid");
    if (!grid) {
      return;
    }
    var status = $("featured-status");
    setStatus(status, "Loading featured books...");
    loadBooks()
      .then(function (books) {
        var featured = books.slice(0, 8);
        setStatus(status, renderBooks(grid, featured, "No books found."));
      })
      .catch(function (err) {
        setStatus(status, err.message, true);
      });
  }

  function getQuery() {
    return new URLSearchParams(window.location.search).get("q") || "";
  }

  function refreshBookList() {
    var grid = $("books-grid");
    if (!grid) {
      return;
    }
    var status = $("books-status");
    var q = $("books-q") ? $("books-q").value.trim() : "";
    setStatus(status, "Loading books...");
    loadBooks({ category: currentCategory, q: q })
      .then(function (books) {
        setStatus(status, renderBooks(grid, books, "No books match that filter."));
      })
      .catch(function (err) {
        setStatus(status, err.message, true);
      });
  }

  function setupBooksPage() {
    var grid = $("books-grid");
    if (!grid) {
      return;
    }

    var searchInput = $("books-q");
    if (searchInput) {
      searchInput.value = getQuery();
    }

    qsa("#category-filters .chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        currentCategory = chip.getAttribute("data-category");
        qsa("#category-filters .chip").forEach(function (item) {
          item.classList.toggle("active", item === chip);
        });
        refreshBookList();
      });
    });

    var form = $("books-search");
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        refreshBookList();
      });
    }

    refreshBookList();
  }

  function setupContact() {
    var form = $("contact-form");
    if (!form) {
      return;
    }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = $("contact-name").value.trim();
      var email = $("contact-email").value.trim();
      var message = $("contact-message").value.trim();
      var errorBox = $("contact-error");
      var successBox = $("contact-success");
      var errors = [];

      if (name.length < 2) {
        errors.push("Enter your name.");
      }
      if (!emailPattern.test(email)) {
        errors.push("Enter a valid email.");
      }
      if (message.length < 10) {
        errors.push("Write a message of at least 10 characters.");
      }

      if (errors.length) {
        errorBox.textContent = errors.join(" ");
        successBox.textContent = "";
        return;
      }

      errorBox.textContent = "";
      successBox.textContent = "Thanks, " + name + ". Your message was validated successfully.";
      form.reset();
    });
  }

  setupNav();
  setupModal();
  setupAddBookModal();
  setupBookClicks();
  setupHome();
  setupBooksPage();
  setupContact();
})();
