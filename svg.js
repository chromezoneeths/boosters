const {readFile} = require('fs');
const gm = require('gm');

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
		out = out.replace(new RegExp(`{${i}}`, 'g'), ctx[i]);
	}

	return out;
}

module.exports = {
	generateImage,
	streamSvgAsPng
};

function streamSvgAsPng(svg) {
	const svgBuf = Buffer.from(svg, 'utf8');
	return gm(svgBuf, 'image.svg').stream('png');
}
