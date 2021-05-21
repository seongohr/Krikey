# Krikey code challenge
## Part 1: SQL Challenge
### 1. Who are the first 10 authors ordered by date_of_birth?
<pre>
<code>
SELECT name FROM authors
ORDER BY date_of_birth
LIMIT 10;
</code>
</pre>

### 2. What is the sales total for the author named “Lorelai Gilmore”?
<pre>
<code>
SELECT sum(s.item_price * s.quantity)
FROM sale_items AS s
JOIN books AS b
    JOIN authors AS a
        ON b.author_id = a.id
        AND a.name = 'Lorelai Gilmore'
ON s.book_id = b.id;
</code>
</pre>

### 3. What are the top 10 performing authors, ranked by sales revenue?
<pre>
<code>
SELECT a.name, sum(s.item_price * s.quantity)
FROM sale_items AS s
    JOIN books AS b
        JOIN authors AS a ON b.author_id = a.id
    ON s.book_id = b.id
GROUP BY a.name
ORDER BY sum(s.item_price * s.quantity) DESC
LIMIT 10;
</code>
</pre>

<hr/>

## Part 2A: Write an API Endpoint

<hr/>

## Part 3: Build Docker Container and steps to deploy

<hr/>
