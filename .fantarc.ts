const path = require('path');

const dest = path.resolve(__dirname, 'dest');

export default {
	ports: {
		test: 1234,
		live: 1234,
	},
	paths: {
		screenies: (id) => path.resolve(dest, `video-${id}.png`),
		screenie: path.resolve(dest, 'screenie.png'),
		meta: path.resolve(dest, 'meta.json'),
		dest,
	},
};
