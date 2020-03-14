require('dotenv').config();
const fs = require('fs');
const snoowrap = require('snoowrap');

const r = new snoowrap({
	userAgent: 'put your user-agent string here',
	clientId: process.env.REDDIT_APP,
	clientSecret: process.env.REDDIT_SECRET,
	refreshToken: process.env.REDDIT_RT,
});

const retrieve = async () => {
	let existing = {};
	try {
		existing = require('../data/controversials.json');
		if (!(existing instanceof Object)) {
			throw 'no';
		}
	} catch {}
	const [controversials, top] = await Promise.all([
		r.getSubreddit('relationships').getControversial({
			time: 'week',
			count: 100,
		}),
		r.getSubreddit('relationships').getTop({
			time: 'week',
			count: 100,
		}),
	]);

	const asObject = Object.fromEntries(
		[...top, ...controversials].map((post) => [post.id, post])
	);

	fs.writeFileSync(
		__dirname + '/../data/controversials.json',
		JSON.stringify(asObject)
	);
};

retrieve();
