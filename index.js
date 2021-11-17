const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const i18n = require("i18n-express");
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { google } = require('googleapis');
const config = require('./APIKEY');

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

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 } }));

app.use(i18n({
    translationsPath: path.join(__dirname, 'i18n'),
    siteLangs: ["en", "zu", "af", "xh", "nso"],
    textsVarName: 'translation'
}));

// Provide the required configuration
const CREDENTIALS = config.CREDENTIALS
const calendarId = config.CALENDAR_ID;

// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({ version: "v3" });

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

const TIMEOFFSET = '+02:00';

// Get date-time string for calender
const dateTimeForCalander = () => {

    let date = new Date();

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let day = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }

    let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

    let event = new Date(Date.parse(newDateTime));

    let startDate = event;
    // Delay in end time is 1
    let endDate = new Date(new Date(startDate).setHours(startDate.getHours() + 1));

    return {
        'start': startDate,
        'end': endDate
    }
};

// Insert new event to Google Calendar
const insertEvent = async (event) => {

    try {
        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event
        });

        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
    }
};

let dateTime = dateTimeForCalander();

// Event for Google Calendar
let event = {
    'summary': `This is the test summary.`,
    'description': `This is the description.`,
    'start': {
        'dateTime': dateTime['start'],
        'timeZone': 'Africa/Johannesburg'
    },
    'end': {
        'dateTime': dateTime['end'],
        'timeZone': 'Africa/Johannesburg'
    }
};


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

    app.get('/test', function (req, res) {
        res.render('test', {
            layouts: 'main',
        });
    });

    app.get('/new_appointment', function (req, res) {
        res.render('new_appoint', {
            layouts: 'main',
        });
        // res.sendFile(path.join(__dirname+'/calender.html'));
    });

    app.get('/followUp', function (req, res) {
        // res.sendFile(path.join(__dirname+'/test2.html'));
        res.render('followUp', {
            layouts: 'main',
        });
    });

});

const PORT = process.env.PORT || 2021;

app.listen(PORT, function () {
    console.log('App started at port:' + PORT);
})