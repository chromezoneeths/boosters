const svg = require('../svg');

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
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<svg width="400" height="110">
  <rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />
</svg>`;
	const buf = await svg.asPng(svgString);
	if (buf instanceof Error) {
		throw buf;
	}
});
