const svg = require('../svg');
const fs = require('fs');

beforeEach(() => {
	jest.resetModules(); // Most important - it clears the cache
});

test('svg production includes name', async () => {
	const output = await svg.generateImage('john@example.com', 'John Smith');
	expect(output.includes('John Smith'));
});

test('png production works', async () => {
	process.env.ALLOW_GM = 'TRUE';
	const svgString = `
<svg width="400" height="110">
  <rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />
</svg>`;
	const stream = svg.streamSvgAsPng(svgString);
	expect(stream);
	stream.pipe(fs.createWriteStream('/dev/null'));
});
