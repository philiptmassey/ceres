var bodyParser = require('body-parser');
var express = require('express');
var pg = require('pg');

// App set up

var app = express();
app.set('port', (process.env.PORT || 8080));

app.use(bodyParser.urlencoded({
    extended: true
}));

// URI Handlers

app.get('/', function(request, response) {
    response.send('Hello Ken!');
});

app.post('/add', function(request, response) {
    id = request.body.id
    data = request.body.data

    //TODO: check for empyt id/data and do not store.

    pg.connect(process.env.DATABASE_URL, function(error, client, done) {
        if (error) {
            response.status(500).send(error);
            return;
        }
        
        client.query('INSERT into data (id, data) values($1, $2)',
                     [id, data], function(error, result) {
            done();
            if (error) {
                response.status(500).send(error);
                return;
            }

            response.status(200).send();
         });
    });
});

app.get('/data', function(request, response) {
    pg.connect(process.env.DATABASE_URL, function(error, client, done) {
        if (error) {
            response.status(500).send(error);
            return;
        }
        client.query('SELECT * from data', function(error, result) {
            done();
            if (error) {
                response.status(500).send(error);
                return;
            }

            response.setHeader('Content-Type', 'application/json');
            response.status(200).send(JSON.stringify(result.rows));
        });
    });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
