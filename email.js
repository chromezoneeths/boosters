const nodemailer = require('nodemailer');

const fs = require('sb-fs');

let transporter = async () => {
	if (process.env.CI) {
		console.log('SKIP MAIL IN CI');
	} else {
		let cfg = await fs.readFile('./transport.json').catch(() => undefined);
		if (!cfg) {
			console.error('CONFIG FILE UNREADABLE, CANNOT SEND MAIL');
			return;
		}

		try {
			cfg = JSON.parse(cfg);
		} catch {
			console.error('CONFIG FILE IS INVALID JSON, CANNOT SEND MAIL');
			return;
		}

		const transporter_ = nodemailer.createTransport(cfg);
		const verification = await new Promise(resolve => {
			transporter_.verify((error, success) => resolve({error, success}));
		});
		if (verification.error) {
			console.error('ERROR INITIALIZING MAILER, CANNOT SEND MAIL');
			return;
		}

		transporter = transporter_;
	}
};

async function sendEmail(target, content) {
	// Code to send with sendmail
	console.log('SEND EMAIL', target);
	if (typeof transporter === 'function') {
		await transporter();
	}

	if (typeof transporter === 'function') {
		return;
	}

	const cfg = JSON.parse(await fs.readFile('./transport.json'));
	const message = {
		from: `${cfg.auth.username}@${cfg.host}`,
		to: target,
		envelope: {
			from: `Boosters Server <${cfg.auth.username}@${cfg.host}>`,
			to: target
		},
		attachments: [
			{
				filename: 'card.png',
				content
			}
		],
		text: 'You\'ve received an ETHS Booster card. The card\'s image is attached.'
	};
	const result = await new Promise(resolve => {
		transporter.sendMail(message, (error, info) => resolve({error, info}));
	});
	console.log(result);
	return result;
}

module.exports = {
	sendEmail
};
