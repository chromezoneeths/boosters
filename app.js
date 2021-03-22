/* eslint-disable no-unused-vars */
// TODO: fix that ^
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
const formidable = require('formidable');

const {sendEmail} = require('./email');
const {generateImage} = require('./svg');
// TODO: Replace with promisified fs
const fs = require('fs');

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

app.post('/generate-batch.html', (request, response) => {
	new formidable.IncomingForm().parse(request, async (error, fields, files) => {
		if (error) {
			console.error('ERROR', error);
			response.writeHead(500, 'Form parsing failed');
			response.end();
			return;
		}

		const fileSpec = files.file;
		const file = await new Promise(resolve => {
			// TODO: Convert to promisified fs
			fs.readFile(fileSpec.path, (error, data) => {
				if (error) {
					resolve(false);
					return;
				}

				resolve(data.toString('utf8'));
			});
		}).catch(() => false);
		if (file) {
			try {
				const entries = [];
				for (const entry of file.split('\n')) {
					const split = entry.split(',');
					entries.push({name: split[0], address: split[1]});
				}

				for (const entry of entries) {
					handleForm(entry.address, entry.name);
				}

				response.redirect('/generate-batch.html');
				response.end();
			} catch {
				response.writeHead(500);
				response.end();
			}
		} else {
			response.writeHead(500);
			response.end();
		}
	});
});

app.use('/', express.static(path.join(__dirname, 'static')));
