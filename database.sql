DROP TABLE IF EXISTS authors, books, sale_items CASCADE;

CREATE TABLE authors(
    id SERIAL PRIMARY KEY,
    name TEXT,
    date_of_birth TIMESTAMP
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    author_id INTEGER REFERENCES authors (id),
    isbn TEXT
);

CREATE TABLE sale_items (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books (id),
    customer_name TEXT,
    item_price MONEY,
    quantity INTEGER
);

INSERT INTO authors(name, date_of_birth)
VALUES ('Eleanor Russel', NOW() - INTERVAL '1 DAY'),
       ('Danny Kim', NOW() - INTERVAL '100 DAY'),
       ('Renee Gross', NOW() - INTERVAL '34 DAY'),
       ('Vivian Reed', NOW() -  INTERVAL '45 DAY'),
       ('Kari Peterson', NOW() -  INTERVAL '67 DAY'),
       ('Jan Phelps', NOW() -  INTERVAL '134 DAY'),
       ('Kristina Patric', NOW() -  INTERVAL '187 DAY'),
       ('Margaret Becker', NOW() -  INTERVAL '23 DAY'),
       ('Amos Logan', NOW() -  INTERVAL '145 DAY'),
       ('Jacquelyn Mcquire', NOW() -  INTERVAL '135 DAY'),
       ('Lorelai Gilmore',NOW() -  INTERVAL '114 DAY'),
       ('Spencer Adkins', NOW() -  INTERVAL '157 DAY'),
       ('Raquel Montgomery', NOW() -  INTERVAL '113 DAY'),
       ('Julia williams', NOW() -  INTERVAL '168 DAY'),
       ('Gretchen Hamilton', NOW() -  INTERVAL '113 DAY'),
       ('Olivia Burns', NOW() -  INTERVAL '13 DAY');

INSERT INTO books(author_id, isbn)
SELECT floor(random() * 16 + 1), md5(random()::TEXT) FROM generate_series(1,100);

INSERT INTO sale_items(book_id, customer_name, item_price, quantity)
SELECT floor(random() * 100 + 1), md5(random()::TEXT), random() * 10::MONEY, floor(random() * 50 + 1)  FROM generate_series(1,1000000);





-- SELECT * FROM authors;
-- SELECT * FROM books;
-- SELECT * FROM sale_items;

SELECT name FROM authors
ORDER BY date_of_birth
LIMIT 10;

SELECT sum(s.item_price * s.quantity)
FROM sale_items AS s
JOIN books AS b
    JOIN authors AS a
        ON b.author_id = a.id
        AND a.name = 'Lorelai Gilmore'
ON s.book_id = b.id;

SELECT a.name, sum(s.item_price * s.quantity)
FROM sale_items AS s
    JOIN books AS b
        JOIN authors AS a ON b.author_id = a.id
    ON s.book_id = b.id
GROUP BY a.name
ORDER BY sum(s.item_price * s.quantity) DESC
LIMIT 10;




