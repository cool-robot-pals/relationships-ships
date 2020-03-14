const chalk = require('chalk');

export enum Realm {
	Tensor = 'TensorFlow',
	Meta = 'Post meta',
	Scrapper = 'Reddit scrapper',
	VideoShot = 'Video snaps',
	CompositeShot = 'Composite snap',
}

interface Options {
	spaced?: boolean;
}
const log = (realm: Realm, msg: string, { spaced }: Options = {}) => {
	if (spaced) {
		console.log(
			chalk.dim(new Array(realm.length).fill(' ').join('') + '...' + msg)
		);
	} else {
		console.log(`[${chalk.blue(realm)}] ${msg}`);
	}
};

const logError = (realm: Realm, msg: string) => {
	log(realm, chalk.red(msg));
};

let queue = [];
const logOngoing = (realm: Realm, msg: string) => {
	log(realm, msg);
	queue.push(msg);
	return (donemsg?: string) => {
		queue.shift();
		let info = 'done';
		if (queue.length) {
			info += ` (${msg})`;
		}
		if (donemsg) {
			info += ` – ${donemsg}`;
		}
		log(realm, info, { spaced: true });
	};
};

const logCounter = (realm: Realm, msg: string, to: number) => {
	let count = 0;
	return [
		() => {
			count++;
			log(realm, msg + ` (${count}/${to})`);
		},
		() => {
			log(realm, msg + ` (${count}/${to})`);
		},
	];
};

export const buildLogger = (realm: Realm) => ({
	log: (msg: string) => log(realm, msg),
	logError: (msg: string) => logError(realm, msg),
	logOngoing: (msg: string) => logOngoing(realm, msg),
	logCounter: (msg: string, to: number) => logCounter(realm, msg, to),
});
