import config from '../../.fantarc';
import { Snaps } from '../../code/help/types';
import { buildLogger, Realm } from '../help/logger';
import { startServer } from '../help/puppet';
import { openPage } from './../help/puppet';

const { screenie } = config.paths;
const { log, logOngoing } = buildLogger(Realm.CompositeShot);

const takeScreenshot = async (url) => {
	const rt = logOngoing('Waiting for screen');
	return openPage(url, async (log, page) => {
		if (log.type === Snaps.Composite && log.state === 'ready') {
			await page.screenshot({ path: screenie, type: 'png' });
			rt();
			return true;
		}
	});
};

const doIt = async () => {
	const rt = logOngoing('Starting server');
	const url = await startServer('composite');
	rt();
	await takeScreenshot(url);
};
if (!module.parent) {
	doIt().then(() => {
		process.exit();
	});
}
export default doIt;
