var express = require('express');
var pg = require('pg');

var app = express();
app.set('port', (process.env.PORT || 8080));

// bodyParse.urlencoded(options)
// Parses the text as URL encoded data and exposes the resulting object on
// req.body
// from http://stackoverflow.com/questions/4295782/how-do-you-extract-post-data-in-node-js
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(request, response) {
    response.send('Hello Ken!');
});

app.post('/add', function(request, response) {
    id = req.body.id
    data = req.body.data

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if (err) {
            response.status(500).send('Error connecting to database.');
            return;
        }
        client.query('INSERT into data (id, data) values($1, $2)',
                     [id, data], function(err, result) {
            done();
            if (error) {
                response.status(500).send('Error inserting into database.');
                return;
            }
         });
    });
});

app.get('/datadump', function(request, response) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if (err) {
            response.status(500).send('Error connecting to database.');
            return;
        }
        client.query('SELECT * from data', function(err, result) {
            done();
            if (err) {
                response.status(500).send('Error selecting in database.');
                return;
            } else {
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify(result.rows));
            }
        });
    });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
