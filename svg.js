const {readFile} = require('fs');
let gm_;
try {
	gm_ = require('gm');
} catch {
	console.error('GraphicsMagick not found, png production won\'t work');
	gm_ = false;
}

const gm = gm_;

async function generateImage(email, name) {
	console.log('BUILD FOR', email, name);
	const ctx = {
		/* eslint-disable camelcase */
		start_year: 2020,
		end_year: 2021,
		/* eslint-enable camelcase */
		name
	};
	let out = await new Promise(resolve => {
		readFile('./template.svg', 'utf8', (error, data) => {
			console.assert(!error);
			resolve(data);
		});
	});
	for (const i of Object.getOwnPropertyNames(ctx)) {
		console.log(i);
		out = out.replace(new RegExp(`{${i}}`, 'g'), ctx[i]);
	}

	return out;
}

module.exports = {
	generateImage,
	streamSvgAsPng
};

function streamSvgAsPng(svg) {
	if (gm) {
		try {
			const svgBuf = Buffer.from(svg, 'utf8');
			return gm(svgBuf, 'image.svg').stream('png');
		} catch {
			return false;
		}
	}

	return false;
}
