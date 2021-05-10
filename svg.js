const fs = require('sb-fs');
const {exec} = require('child_process');

async function generateImage(email, name, count) {
	console.log('BUILD FOR', email, name);
	const ctx = {
		/* eslint-disable camelcase */
		start_year: 2020,
		end_year: 2021,
		/* eslint-enable camelcase */
		name,
		count,
		people: count > 1 ? 'people' : 'person'
	};
	let out = await fs.readFile('./template.svg', 'utf8');
	for (const i of Object.getOwnPropertyNames(ctx)) {
		out = out.replace(new RegExp(`{${i}}`, 'g'), ctx[i]);
	}

	return out;
}

module.exports = {
	generateImage,
	asPng
};

let runningConversions = 0;

async function asPng(svg) {
	const thisConversion = runningConversions++;
	await fs.mkdir(`/tmp/svg_convert_${thisConversion}`).catch(() => {});
	await fs.writeFile(`/tmp/svg_convert_${thisConversion}/svg.svg`, svg);
	await new Promise(resolve => {
		exec(`convert /tmp/svg_convert_${thisConversion}/svg.svg /tmp/svg_convert_${thisConversion}/out.png`, () => {
			resolve();
		});
	});
	const output = await fs.readFile(`/tmp/svg_convert_${thisConversion}/out.png`).catch(error => error);
	runningConversions--;
	return output;
}
