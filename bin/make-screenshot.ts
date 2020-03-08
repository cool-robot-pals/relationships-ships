import { Logger, Snaps } from './../code/help/types';
import config from '../.fantarc';
const Bundler = require('parcel-bundler');
const puppeteer = require('puppeteer');

const { screenies } = config.paths;

const startServer = () =>
	new Promise((rt) => {
		const bundler = new Bundler(__dirname + '/../code/index.html');
		bundler.on('buildEnd', () => {
			rt(`http://localhost:${config.ports.test}`);
		});
		bundler.serve(config.ports.test);
	});

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
					for await (let key of new Array(6).fill('').map((_, i) => i)) {
						console.log(`Screenshot ${key + 1}/6`);
						await page.screenshot({ path: screenies(key), type: 'png' });
						await page.waitFor(750);
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
