import { Meta } from '../help/types';

require('dotenv').config();

import config from '../.fantarc';
const twitter = require('twitter');
const fs = require('fs');
const chalk = require('chalk');

const client = new twitter({
	consumer_key: process.env.TWITTER_CK,
	consumer_secret: process.env.TWITTER_CS,
	access_token_key: process.env.TWITTER_TK,
	access_token_secret: process.env.TWITTER_TS,
});

const meta = require('../dest/meta.json') as Meta;

(async () => {
	try {
		console.info(chalk.blue(`i Post info:`));
		console.info(meta.post.title.substr(0,200));

		await client
			.post('media/upload', { media: fs.readFileSync(config.paths.screenie) })
			.then((screenshot) =>
				client.post('statuses/update', {
					media_ids: screenshot.media_id_string,
					status: meta.post.title.substr(0,200),
				})
			)
			.then((tweet) => {
				console.info(chalk.green(`✔ Posted: ${meta.post.title.substr(0,200)}`));
				console.info(tweet);
				return true;
			});
	} catch (error) {
		console.error(chalk.red('✘ Post failed'));
		console.error(error);
		return;
	}

	process.exit();
})();
