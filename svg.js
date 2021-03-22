const fs = require('sb-fs');
const {exec} = require('child_process');

async function generateImage(email, name) {
	console.log('BUILD FOR', email, name);
	const ctx = {
		/* eslint-disable camelcase */
		start_year: 2020,
		end_year: 2021,
		/* eslint-enable camelcase */
		name
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
	runningConversions++;
	await fs.mkdir(`/tmp/svg_convert_${runningConversions}`).catch(() => {});
	await fs.writeFile(`/tmp/svg_convert_${runningConversions}/svg.svg`, svg);
	await new Promise(resolve => {
		exec(`convert /tmp/svg_convert_${runningConversions}/svg.svg /tmp/svg_convert_${runningConversions}/out.png`, () => {
			resolve();
		});
	});
	const output = await fs.readFile(`/tmp/svg_convert_${runningConversions}/out.png`).catch(error => error);
	return output;
}
