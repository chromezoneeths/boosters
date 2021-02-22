const keys = require('./keys.json');
const {
    PORT,
    MAILGUN_API_KEY,
    MAILGUN_DOMAIN
} = keys;

const crypto = require('crypto')
const express = require('express');
const bodyParser = require("body-parser");
const querystring = require('querystring');
const hbs = require('hbs');

const {sendEmail} = require('./email');
const {generateImage} = require('./svg');

const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Handlebars setup
app.set('view engine', 'hbs');
app.engine('html', hbs.__express);


const server = app.listen(PORT, function () {
    const host = server.address().address
    const port = server.address().port

    console.log("Server listening at http://%s:%s", host, port)
})

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// Handle form submit to generate a new card

app.get('/generate', async (req, res) => {
    const {
        query
    } = req;
    const {
        ok,
        status
    } = query;
    let data = {};
    if (ok && status) data = {
        ok,
        status
    };
    res.render('pages/generate', data);
})

async function handleForm(email, name) {
    console.log(email, name);
    const image = await generateImage(email, name);
    sendEmail("...");
}

app.post('/generate', async (req, res) => {
    const {
        body
    } = req;
    const {
        email,
        name
    } = body;
    if (!email || !name) return res.status(400).redirect('/generate?' + querystring.stringify({
        ok: false,
        status: 'Invalid form content.'
    }));
    if (!EMAIL_REGEX.test(email)) return res.redirect('/generate?' + querystring.stringify({
        ok: false,
        status: 'Invalid email.'
    }));

    // PASS TO EMAIL HANDLER
    handleForm(email, name)


    res.redirect('/generate?' + querystring.stringify({
        ok: true,
        status: 'Sent email.'
    }));
})

app.use('/', express.static(__dirname + "/static"));