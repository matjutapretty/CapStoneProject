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

    await db.migrate();

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

    app.get('/login', function (req, res) {
        res.render('login', {
            layouts: 'main',
            login_Message: req.session.message
        });
    });

    app.post('/login', async function (req, res) {
        req.session.username = '';
        req.session.password = '';

        await db.all('SELECT * FROM patient_login WHERE IDno = ? AND Pwd = ?', req.body.username, req.body.password)
            .then(function (patient_login) {
                if (patient_login.length != 0) {
                    req.session.username = patient_login[0].IDno;
                    req.session.password = patient_login[0].Pwd;
                    res.redirect('/service');
                } else {
                    req.session.username = ' ';
                    req.session.password = ' ';
                    req.session.message = "Incorrect Username or Password"
                    res.redirect('/login');
                }
            });
        
    });

    app.get('/register', function (req, res) {
        res.render('registration', {
            layouts: 'main',
        });
    });

    app.post('/register', async function (req, res) {
        let register = 'INSERT INTO patient_login(Firstname, Lastname, DOB, Gender, IDno, ConNo, Email, LangPref, Pwd) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

        await db.run(register, req.body.firstName, req.body.lastName, req.body.DOB, req.body.gender, req.body.IDno, req.body.cellNo, req.body.email, req.body.language, req.body.password);

        console.log(
            "First Name: " + req.body.firstName + "\n" +
            "Last Name: " + req.body.lastName + "\n" +
            "DOB: " + req.body.DOB + "\n" +
            "Gender: " + req.body.gender + "\n" +
            "ID No:" + req.body.IDno + "\n" +
            "Cell: " + req.body.cellNo + "\n" +
            "Email: " + req.body.email + "\n" +
            "Lang: " + req.body.language + "\n" +
            "PWD: " + req.body.password
        )
        res.redirect('/login');
    });

    app.get('/service', function (req, res) {
        res.render('service', {
            layouts: 'main',
        });
    });

    app.get('/appointment', function (req, res) {
        res.render('appoint', {
            layouts: 'main',
        });
    });

    app.get('/medication', function (req, res) {
        res.render('med', {
            layouts: 'main',
        });
    });

    app.get('/new_appointment', function (req, res) {
        res.render('new_appoint', {
            layouts: 'main',
        });
    });

    app.get('/followUp', function (req, res) {
        res.render('followUp', {
            layouts: 'main',
        });
    });

});

const PORT = process.env.PORT || 2021;

app.listen(PORT, function () {
    console.log('App started at port:' + PORT);
})