const path = require('path');
const fs = require('fs');

const dest = path.resolve(__dirname, 'dest');
const videoCapturePrefix = 'videocapture';

export default {
	ports: {
		test: 1234,
		live: 1234,
	},
	constants: {
		videoCapturePrefix,
	},
	paths: {
		videoCapture: (id) => path.resolve(dest, `${videoCapturePrefix}-${id}.png`),
		videoCaptures: () =>
			fs
				.readdirSync(path.resolve(dest))
				.filter(
					(item: string) =>
						item.startsWith(videoCapturePrefix) && item.endsWith('.png')
				)
				.map((item) => path.resolve(dest, item)),
		screenie: path.resolve(dest, 'screenie.png'),
		scrap: path.resolve(dest, 'scrap.json'),
		meta: path.resolve(dest, 'meta.json'),
		photoMeta: path.resolve(dest, 'photo-meta.json'),
		dest,
	},
};
