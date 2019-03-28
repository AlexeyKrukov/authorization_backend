let express = require('express');
let bodyParser = require('body-parser');
let promise = require('bluebird');

let initOptions = {
    promiseLib: promise
};

let pgp = require('pg-promise')(initOptions);
let app = express();

const params = {
    host: 'localhost',
    port: 5433,
    database: 'webapp',
    user: 'alexey',
    password: '1997'
};

const db = pgp(params); // database instance;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json({
    type: ['application/json', 'text/plain']
}));

app.post('/enter', function(req, res) {
    return db.oneOrNone('SELECT * FROM users WHERE username=($1) AND password=($2)', [req.body.login, req.body.password])
        .then(resp => {
            return db.none('UPDATE users SET last_login = now() WHERE user_id=($1)', [resp.user_id])
        }).then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.log('ERROR:', error);
            res.sendStatus(500);
        });
});
app.post('/registration', function(req, res) {
    return db.none('insert into users(username, password, email, phone_number, city, country, created_on, last_login) values(req.body.username, req.body.password, req.body.email, req.body.phone_number, req.body.city, req.body.country, now(), now() )')
        .then(data => {
            console.log('DATA:', data);
            res.sendStatus(200);
        })
        .catch(error => {
            console.log('ERROR:', error);
            res.sendStatus(500);
        });
});
module.exports = app;
