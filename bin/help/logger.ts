const chalk = require('chalk');

export enum Realm {
	Tensor = 'TensorFlow',
	VideoShot = 'Video snaps',
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
	return () => {
		queue.shift();
		let info = 'done';
		if (queue.length) {
			info += ` (${msg})`;
		}
		log(realm, info, { spaced: true });
	};
};

export const buildLogger = (realm: Realm) => ({
	log: (msg: string) => log(realm, msg),
	logError: (msg: string) => logError(realm, msg),
	logOngoing: (msg: string) => logOngoing(realm, msg),
});
