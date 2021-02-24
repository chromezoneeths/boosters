const keys = require('./keys.json');
const {
	PORT,
	MAILGUN_API_KEY,
	MAILGUN_DOMAIN
} = keys;

const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const hbs = require('hbs');
const path = require('path');
const morgan = require('morgan');

const {sendEmail} = require('./email');
const {generateImage} = require('./svg');

const app = express();
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
app.use(morgan('tiny'));

// Handlebars setup
app.set('view engine', 'hbs');
app.engine('html', hbs.__express);

const server = app.listen(PORT, () => {
	const host = server.address().address;
	const port = server.address().port;

	console.log('LISTEN %s %s', host, port);
});

const EMAIL_REGEX = /^[\w.!#$%&’*+/=?^`{|}~-]+@[a-zA-Z\d-]+(?:\.[a-zA-Z\d-]+)*$/;

// Handle form submit to generate a new card

app.get('/generate', async (request, response) => {
	const {
		query
	} = request;
	const {
		ok,
		status
	} = query;
	let data = {};
	if (ok && status) {
		data = {
			ok,
			status
		};
	}

	response.render('pages/generate', data);
});

async function handleForm(email, name) {
	console.log(email, name);
	const image = await generateImage(email, name);
	sendEmail('...');
}

app.post('/generate', async (request, response) => {
	const {
		body
	} = request;
	const {
		email,
		name
	} = body;
	if (!email || !name) {
		console.log('BAD FORM');
		return response.status(400).redirect('/generate?' + querystring.stringify({
			ok: false,
			status: 'Invalid form content.'
		}));
	}

	if (!EMAIL_REGEX.test(email)) {
		console.log('BAD EMAIL ADDRESS');
		return response.redirect('/generate?' + querystring.stringify({
			ok: false,
			status: 'Invalid email.'
		}));
	}

	// PASS TO EMAIL HANDLER
	handleForm(email, name);

	response.redirect('/generate?' + querystring.stringify({
		ok: true,
		status: 'Sent email.'
	}));
});

app.use('/', express.static(path.join(__dirname, 'static')));
