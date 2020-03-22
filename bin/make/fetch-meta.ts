import rs from '../../.fantarc';
import ships from '../../assets/ships';
import { bend } from '../../help/gender';
import { parse } from '../../help/parser';
import { Meta } from '../../help/types';
import { buildLogger, Realm } from '../help/logger';
const { log, logOngoing } = buildLogger(Realm.Meta);
const fs = require('fs');
const data = require(rs.paths.scrap);
const posts = parse(data);

const randomArrKey = <T>(items: T[]): T =>
	items[Math.floor(Math.random() * items.length)];

export const getMeta = (): Meta => {
	const ship = randomArrKey(ships);
	let post = randomArrKey(posts);
	if (ship.bend) {
		post = bend(post, ship.bend);
	}
	return { ship, post };
};

export const writeMeta = (meta: Meta) => {
	fs.writeFileSync(rs.paths.meta, JSON.stringify(meta));
};

const doit = () => {
	writeMeta(getMeta());
	log('Wrote post meta');
};

export default doit;

if (!module.parent) {
	doit();
}
