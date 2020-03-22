require('dotenv').config();
const snoowrap = require('snoowrap');
import rs from '../.fantarc';
import { buildLogger, Realm } from './help/logger';
const { logOngoing } = buildLogger(Realm.Scrapper);

const fs = require('fs');

const r = new snoowrap({
	userAgent: 'put your user-agent string here',
	clientId: process.env.REDDIT_APP,
	clientSecret: process.env.REDDIT_SECRET,
	refreshToken: process.env.REDDIT_RT,
});

const retrieve = async () => {
	const rt = logOngoing('Fetching posts');

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

	fs.writeFileSync(rs.paths.scrap, JSON.stringify(asObject));
	rt(`${Object.keys(asObject).length} posts`);
};

retrieve();
