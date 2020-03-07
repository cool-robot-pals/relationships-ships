import { parse } from './parser';
import { bend, Gender } from './gender';

const data = require('../data/controversials.json');
const posts = parse(data);

const randomArrKey = <T>(items: T[]): T =>
	items[Math.floor(Math.random() * items.length)];

const buildUpFanta = ($root) => {
	const post = bend(randomArrKey(posts), Gender.Boy);

	$root.innerHTML = `<h2>${post.title}</h2><p>${post.selftext}</p>`;

	const tweet = [post.title];

	return { tweet };
};

const go = () => {
	const $root = document.querySelector('x-ship');
	const data = buildUpFanta($root);

	console.log(JSON.stringify(data));
};
go();
