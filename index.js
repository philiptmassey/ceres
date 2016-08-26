var express = require('express');
var pg = require('pg');

var app = express();
app.set('port', (process.env.PORT || 8080));

app.get('/', function(request, response) {
    response.send('Hello Ken!');
});

app.get('/datadump', function(request, response) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if (err) {
            response.status(500).send('Error connecting to database.');
            return;
        }
        client.query('SELECT * from data', function(err, result) {
            if (err) {
                response.status(500).send('Error selecting in database.');
                return
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
