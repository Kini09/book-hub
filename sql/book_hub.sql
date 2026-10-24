-- Book Hub database script
-- Run this in phpMyAdmin (SQL tab) or: mysql -u root < sql/book_hub.sql

CREATE DATABASE IF NOT EXISTS book_hub
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE book_hub;

-- Drop in the right order (feedback depends on books)
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  author VARCHAR(120) NOT NULL,
  category VARCHAR(50) NOT NULL,
  cover_image VARCHAR(255) NOT NULL,
  pdf_path VARCHAR(255) NOT NULL
);

CREATE TABLE feedback (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  comment TEXT NOT NULL,
  book_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_feedback_book
    FOREIGN KEY (book_id) REFERENCES books(id)
    ON DELETE CASCADE,
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
);

INSERT INTO books (title, author, category, cover_image, pdf_path) VALUES
('Pride and Prejudice', 'Jane Austen', 'Fiction', 'assets/covers/pride-and-prejudice.svg', 'pride-and-prejudice.pdf'),
('Frankenstein', 'Mary Shelley', 'Fiction', 'assets/covers/frankenstein.svg', 'frankenstein.pdf'),
('The Adventures of Sherlock Holmes', 'Arthur Conan Doyle', 'Mystery', 'assets/covers/sherlock-holmes.svg', 'sherlock-holmes.pdf'),
('A Tale of Two Cities', 'Charles Dickens', 'Fiction', 'assets/covers/tale-of-two-cities.svg', 'tale-of-two-cities.pdf'),
('The Time Machine', 'H. G. Wells', 'Sci-Fi', 'assets/covers/time-machine.svg', 'time-machine.pdf'),
('The Art of War', 'Sun Tzu', 'Non-Fiction', 'assets/covers/art-of-war.svg', 'art-of-war.pdf'),
('Alice\'s Adventures in Wonderland', 'Lewis Carroll', 'Children', 'assets/covers/alice.svg', 'alice.pdf'),
('Dracula', 'Bram Stoker', 'Horror', 'assets/covers/dracula.svg', 'dracula.pdf'),
('The Odyssey', 'Homer', 'Classics', 'assets/covers/odyssey.svg', 'odyssey.pdf'),
('The War of the Worlds', 'H. G. Wells', 'Sci-Fi', 'assets/covers/war-of-the-worlds.svg', 'war-of-the-worlds.pdf'),
('1984', 'George Orwell', 'Sci-Fi', 'assets/covers/1984.svg', '1984.pdf'),
('The Great Gatsby', 'F. Scott Fitzgerald', 'Classics', 'assets/covers/great-gatsby.svg', 'the-great-gatsby.pdf'),
('To Kill a Mockingbird', 'Harper Lee', 'Fiction', 'assets/covers/mockingbird.svg', 'to-kill-a-mockingbird.pdf'),
('Moby-Dick', 'Herman Melville', 'Adventure', 'assets/covers/moby-dick.svg', 'moby-dick.pdf'),
('The Picture of Dorian Gray', 'Oscar Wilde', 'Horror', 'assets/covers/dorian-gray.svg', 'the-picture-of-dorian-gray.pdf'),
('Meditations', 'Marcus Aurelius', 'Philosophy', 'assets/covers/meditations.svg', 'meditations.pdf'),
('The Hound of the Baskervilles', 'Arthur Conan Doyle', 'Mystery', 'assets/covers/baskervilles.svg', 'the-hound-of-the-baskervilles.pdf'),
('The Hobbit', 'J. R. R. Tolkien', 'Fantasy', 'assets/covers/hobbit.svg', 'the-hobbit.pdf'),
('Brave New World', 'Aldous Huxley', 'Sci-Fi', 'assets/covers/brave-new-world.svg', 'brave-new-world.pdf'),
('Crime and Punishment', 'Fyodor Dostoevsky', 'Classics', 'assets/covers/crime-and-punishment.svg', 'crime-and-punishment.pdf'),
('Little Women', 'Louisa May Alcott', 'Fiction', 'assets/covers/little-women.svg', 'little-women.pdf'),
('The Prince', 'Niccolò Machiavelli', 'Philosophy', 'assets/covers/the-prince.svg', 'the-prince.pdf');

