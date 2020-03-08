import rs from '../.fantarc';
import ships from '../assets/ships';
import { bend } from '../code/help/gender';
import { parse } from '../code/help/parser';
import { Meta } from '../code/help/types';

const fs = require('fs');
const data = require('../data/controversials.json');
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

if (!module.parent) {
	writeMeta(getMeta());
}
