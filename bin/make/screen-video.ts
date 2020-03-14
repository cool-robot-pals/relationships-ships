import { Logger, Snaps } from '../../code/help/types';
import config from '../../.fantarc';

const { videoCapture } = config.paths;
import { buildLogger, Realm } from '../help/logger';
import { startServer, openPage } from '../help/puppet';
const { log, logOngoing } = buildLogger(Realm.VideoShot);

const TAKE_SO_MANY_SCREENS = 10;

const takeScreenshot = async (url) => {
	return openPage(url, async (log, page) => {
		if (log.type === Snaps.Video && log.state === 'ready') {
			for await (let key of new Array(TAKE_SO_MANY_SCREENS)
				.fill('')
				.map((_, i) => i)) {
				let rt = logOngoing(`Screenshot ${key + 1}/${TAKE_SO_MANY_SCREENS}`);
				await page.screenshot({ path: videoCapture(key), type: 'png' });
				await page.waitFor(750);
				rt();
			}
		}
		return true;
	});
};

const doIt = async () => {
	const rt = logOngoing('Starting server');
	const url = await startServer('video');
	rt();
	return await takeScreenshot(url);
};
if (!module.parent) {
	doIt().then(() => {
		process.exit();
	});
}
export default doIt;
