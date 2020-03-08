import { Logger, Snaps } from './../code/help/types';
import config from '../.fantarc';
const Bundler = require('parcel-bundler');
const puppeteer = require('puppeteer');

const { videoCapture } = config.paths;

const startServer = () =>
	new Promise((rt) => {
		const bundler = new Bundler(__dirname + '/../code/index.html');
		bundler.on('buildEnd', () => {
			rt(`http://localhost:${config.ports.test}`);
		});
		bundler.serve(config.ports.test);
	});

const TAKE_SO_MANY_SCREENS = 10;

const takeScreenshot = async (url) => {
	const browser = await puppeteer.launch({
		args: ['--no-sandbox'],
		ignoreHTTPSErrors: true,
	});
	const page = await browser.newPage();
	console.log('Page loaded');
	return new Promise((yay, nay) => {
		page.on('console', async (msg) => {
			try {
				const log = JSON.parse(msg.text()) as Logger;
				if (!log.type) {
					throw new Error('invalid fanta');
				}
				if (log.type === Snaps.Video && log.state === 'ready') {
					for await (let key of new Array(TAKE_SO_MANY_SCREENS)
						.fill('')
						.map((_, i) => i)) {
						console.log(`Screenshot ${key + 1}/${TAKE_SO_MANY_SCREENS}`);
						await page.screenshot({ path: videoCapture(key), type: 'png' });
						await page.waitFor(300);
						console.log(`...done`);
					}
				}
				await browser.close();
				yay();
			} catch (e) {
				console.error(msg.text());
			}
		});
		Promise.all([
			page.setViewport({ width: 1280, height: 720 }),
			page.goto(url),
		]);
	});
};

const doIt = () => startServer().then((url) => takeScreenshot(url));
if (!module.parent) {
	doIt().then(() => {
		process.exit();
	});
}
export default doIt;
