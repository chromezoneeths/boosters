const keys = require('./keys.json');
const {
    PORT,
    MAILGUN_API_KEY,
    MAILGUN_DOMAIN
} = keys;

const crypto = require('crypto')
const express = require('express');
const bodyParser = require("body-parser");
// const mailgun = require('mailgun-js')({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN }); //we should use Mailgun for email sending 

const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

const server = app.listen(PORT, function () {
    const host = server.address().address
    const port = server.address().port

    console.log("Server listening at http://%s:%s", host, port)
})

app.use('/', express.static(__dirname + "/client"))

//for the booster member, they click a link in their email to boosterdomain.com/id/XXXXXXXXX
app.get('/id/:id', async (req, res) => {
    const userId = req.params.id;

    //this is where we do some stuff
    //we should consider HTML rendering here to send a pretty simple HTML page that just fills in the QR code or ID or PIN or whatever
});

// event host scans user's ID and sends request to this
// log the event and send info to host
app.post('/checkin', async (req, res) => {

});