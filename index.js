const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();

var hbs = exphbs.create({
    layoutsDir: './views/layouts',
    helpers: {}
});

app.engine('handlebars', hbs.engine);

app.set('view engine', 'handlebars');

app.use(express.static('public'));
//app.use("/public", express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 } }))

open({
    filename: './patient_database.db',
    driver: sqlite3.Database
}).then(async function (db) {

    // run migrations

    //await db.migrate(); -- remember to uncomment 

    // only setup the routes once the database connection has been established

    app.get('/', function (req, res) {
         // await db.all('SELECT * FROM customer')
        //     .then(function (customer) {
        //         console.log(customer);
        //     });
        res.render('landingPage', {
            layouts: 'main',
        });
    });

    app.get('/login', function(req, res) {
        res.render('login', {
            layouts: 'main',
        });
    });

    app.post('/login', function(req, res) {
        res.redirect('/service');
     });

    app.get('/register', function(req, res) {
        res.render('registration', {
            layouts: 'main',
        });
    });

    app.post('/register', function(req, res) {
       res.redirect('/login');
    });

    app.get('/service', function(req, res) {
        res.render('service', {
            layouts: 'main',
        });
    });    

    app.get('/appointment', function(req, res) {
        res.render('appoint', {
            layouts: 'main',
        });
    });

    app.get('/medication', function(req, res) {
        res.render('med', {
            layouts: 'main',
        });
    });

    app.get('/new_appointment', function(req, res) {
        res.render('new_appoint', {
            layouts: 'main',
        });
    });

    app.get('/followUp', function(req, res) {
        res.render('followUp', {
            layouts: 'main',
        });
    });   

});

const PORT = process.env.PORT || 2021;

app.listen(PORT, function () {
    console.log('App started at port:' + PORT);
})