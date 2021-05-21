var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const { Client } = require('pg')
app.set("etag", false);

// https://scotch.io/tutorials/how-to-optimize-node-requests-with-simple-caching-strategies
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

app.get('/top10authors', flatCacheMiddleware, function(req, res){
        res.setHeader('Content-Type', 'application/json')
        let author = req.query.author_name;
        const isAuthorEmpty = author === ''

        if (!isAuthorEmpty) {
                let regexp = new RegExp(/^[a-z]([-']?[a-z]+)*( [a-z]([-']?[a-z]+)*)+$/i);
                let validName = regexp.test(author)
                if (!validName) {
                        res.statusCode = 400
                        res.send(JSON.stringify({ message : 'invalid name'}));
                        return ;
                }
        }

        query = "SELECT a.name, sum(s.item_price * s.quantity)\n" +
            "FROM sale_items AS s\n" +
            "    JOIN books AS b\n" +
            "        JOIN authors AS a ON b.author_id = a.id\n" +
            "    ON s.book_id = b.id\n" +
            "GROUP BY a.name\n" +
            "ORDER BY sum(s.item_price * s.quantity) DESC\n" +
            "LIMIT 10;"

        if (!isAuthorEmpty) {
                query = "SELECT a.name, sum(s.item_price * s.quantity)\n" +
                    "FROM sale_items AS s\n" +
                    "    JOIN books AS b\n" +
                    "        JOIN authors AS a ON b.author_id = a.id\n" +
                    "    ON s.book_id = b.id\n" +
                    "WHERE a.name='" + author + "'" +
                    "GROUP BY a.name\n" +
                    "ORDER BY sum(s.item_price * s.quantity) DESC\n" +
                    "LIMIT 10;"
        }

        const client = new Client({
                user: 'postgres',
                host: 'localhost',
                database: 'postgres',
                password: 'postgres',
                port: 5432,
        });
        client.connect()
        client.query(query, (err, result) => {
                if (err) {
                        res.statusCode = 500
                        let message = 'Internal Server Error'
                        res.send(JSON.stringify({ status: 500, message : message }));
                        console.log(status)
                } else {
                        if (!result.rowCount) {
                                res.statusCode = 400
                                let message = "The author doesn't exist."
                                res.send(JSON.stringify({ status: 400, message : message }));
                        } else {
                                res.statusCode = 200
                                let message = 'DB server connected'
                                res.send(JSON.stringify({ status: 200, message : message, result: result.rows }));
                        }
                }
                client.end();
        });
});

module.exports = app;
