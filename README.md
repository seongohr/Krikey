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
<pre>
Endpoint: /top10authors?author_name=<name of an author>
</pre>

This API sends the received author's name and the sales revenue of the author to the client, if the name is in the top 10 authors, ranked by sales revenue. 

### Conditions: 
<pre>
<code>
1. If there is a problem on the server,
    - status Code : 500
    - message : Internal Server Error
2. If a client give an invalid name,
    - status Code : 400
    - message : Invalid Name
3. If the name is not in the database,
    - status Code: 400
    - message : The author doesn't exist.
4. If a client doesn't give a name,
    - status Code : 200
    - send the top 10 authors, ranked by sales revenue.
<!-- 1. If a client doesn't give an author's name :
    - status Code :  
    - provide the top 10 performing authors with sales revenue, ranked by sales revenue-->
</code>
</pre>

### Results :
<pre>
<code>
#### URL : /top10authors?author_name=Kari Peterson
{
    "result":"db server connected",
    "rows":
    [
        {
            "name":"Kari Peterson","sum":"$11,539,341.97"
        }
    ]
 }
 
#### URL : /top10authors?author_name=
{
    "result":"db server connected",
    "rows":
        [
            {
                "name":"Renee Gross","sum":"$14,001,994.64"
            },
            {
                "name":"Kari Peterson","sum":"$11,539,341.97"
            },
                                    ...
            {
                "name":"Danny Kim","sum":"$7,628,651.47"
            },
            {
                "name":"Raquel Montgomery","sum":"$7,621,652.22"
            }
        ]
}
</code>
</pre>

<hr/>

## Part 2B: API Performance
<pre>
<code>
#### Caching layer

const flatCache = require('flat-cache')
let cache = flatCache.load('productsCache');
let flatCacheMiddleware = (req,res, next) => {
        let key =  '__express__' + req.originalUrl || req.url
        let cacheContent = cache.getKey(key);
        if( cacheContent){
                res.send( cacheContent );
        }else{
                res.sendResponse = res.send
                res.send = (body) => {
                        cache.setKey(key,body);
                        cache.save();
                        res.sendResponse(body)
                }
                next()
        }
};

</code>
</pre>

#### Result : With the use of caching layer, the performance was improved as below.
![plot](https://github.com/seongohr/Krikey/img/2b_bf.PNG)
![plot](https://raw.githubusercontent.com/seongohr/Krikey/main/img/2b_af.png)


<hr/>

## Part 3: Build Docker Container and steps to deploy

<hr/>
