import { routes } from '../../help/routes';
import config from '../../.fantarc';
import { Logger } from '../../help/types';
const Bundler = require('parcel-bundler');
const puppeteer = require('puppeteer');

export const startServer = (route: keyof typeof routes) =>
	new Promise((rt) => {
		const bundler = new Bundler(__dirname + '/../../parcel/index.html', {
			watch: false,
			logLevel: 1,
		});
		bundler.on('buildEnd', () => {
			rt(`http://localhost:${config.ports.test}/?${route}`);
		});
		bundler.serve(config.ports.test);
	});

export const openPage = async (
	url,
	callback: (log: Logger, page: any) => Promise<boolean>
) => {
	const browser = await puppeteer.launch({
		args: ['--no-sandbox'],
		ignoreHTTPSErrors: true,
	});
	const page = await browser.newPage();
	return new Promise((yay) => {
		page.on('console', async (msg) => {
			try {
				const log = JSON.parse(msg.text()) as Logger;
				if (!log.type) {
					throw new Error('invalid post');
				}
				const isDone = await callback(log, page);
				if (isDone) {
					await browser.close();
					yay();
				}
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
