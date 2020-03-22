import { injectCSS } from '../help/css-vars';
import relativeDate from 'relative-date';
import { Box, Meta, PhotoMeta, Post, Ship, Snaps } from '../help/types';
import { log } from '../help/logger';

let allImages, meta, photoMeta;
try {
	allImages = require('../dest/videocapture-*.png');
	meta = require('../dest/meta.json') as Meta;
	photoMeta = require('../dest/photo-meta.json') as PhotoMeta;
} catch (e) {
	console.error('missing data!!!');
}

interface Data {
	post: Post;
	ship: Ship;
}

const [VIDEO_WIDTH, VIDEO_HEIGHT] = [1280, 720];

const buildUpFanta = ($root, { post }: Data) => {
	$root.innerHTML = `
		<small>
			<strong>r/relationships</strong>
			<span>Posted by u/${post.name}</span>
			<span>${relativeDate(post.created * 1000)}</span>
		</small>
		<h2>${post.title}</h2>
		<p>${post.selftext}</p>
		`;

	const tweet = [post.title];

	return { tweet };
};

type MegaBox = Box & {
	centerx: number;
	centery: number;
	radius: number;
};

const makeMegaBox = (box: Box): MegaBox => ({
	...box,
	centerx: box.width / 2 + box.x,
	centery: box.height / 2 + box.y,
	radius: Math.max(box.width, box.height) / 2,
});

let megaBoxes: { [key: string]: HTMLElement } = {};
const showMegaBox = (id: string, box: MegaBox) => {
	let $preview = document.createElement('x-preview');
	$preview.style.top = box.centery - box.radius + 'px';
	$preview.style.left = box.centerx - box.radius + 'px';
	$preview.style.width = box.radius * 2 + 'px';
	$preview.style.height = box.radius * 2 + 'px';
	if (megaBoxes[id]) {
		megaBoxes[id].remove();
	}
	document.body.appendChild($preview);
	megaBoxes[id] = $preview;
};

enum Location {
	Left = 'left',
	Right = 'right',
	Top = 'top',
	Bottom = 'bottom',
}
const correctBoxOverlap = (target: MegaBox, reference: MegaBox): MegaBox => {
	const locationx =
		target.centerx > reference.centerx ? Location.Right : Location.Left;
	const locationy =
		target.centery > reference.centery ? Location.Bottom : Location.Top;

	let [x, y] = [target.x, target.y];

	if (locationx === Location.Left) {
		if (target.centerx + target.radius > reference.centerx - reference.radius) {
			x = target.x + 10;
		}
	}
	if (locationx === Location.Right) {
		if (reference.centerx + reference.radius > target.centerx - target.radius) {
			x = target.x + 10;
		}
	}
	if (locationy === Location.Top) {
		if (target.centery + target.radius > reference.centery - reference.radius) {
			y = target.y - 10;
		}
	}
	if (locationy === Location.Bottom) {
		if (reference.centery + reference.radius > target.centery - target.radius) {
			y = target.y + 10;
		}
	}

	y = Math.min(y, VIDEO_HEIGHT - target.height - 10);
	y = Math.max(y, 10);
	x = Math.min(x, VIDEO_WIDTH - target.width - 10);
	x = Math.max(x, 10);

	return makeMegaBox({ ...target, x, y });
};

const declareCSSVars = (photoMeta: PhotoMeta) => {
	const image = Object.values<string>(allImages).find((img) =>
		img.includes(
			photoMeta.path
				.split('/')
				.pop()
				.split('.')
				.shift()
		)
	);

	const [width, height] = [VIDEO_WIDTH, VIDEO_HEIGHT];
	const [boxwidth, boxheight] = [420, 240].map(
		(val) => val * 0.9 + Math.random() * (val * 0.2)
	);
	const [boxleft, boxtop] = [width - boxwidth, height - boxheight].map(
		(v) => v * 0.8 * Math.random()
	);

	let postBox = makeMegaBox({
		width: boxwidth,
		height: boxheight,
		x: boxleft,
		y: boxtop,
	});
	const faceBox = makeMegaBox(photoMeta.box);

	let i = 0;
	while (i < 50) {
		i++;
		postBox = correctBoxOverlap(postBox, faceBox);
	}
	const bg = `url(${image})`;

	injectCSS({
		width,
		height,
		boxheight: postBox.height,
		boxwidth: postBox.width,
		boxleft: postBox.x,
		boxtop: postBox.y,
		bg,
	});
};

const go = async () => {
	document.body.innerHTML = '<x-bg><x-ship></x-ship></x-bg>';
	const $root = document.querySelector('x-ship');
	const data = buildUpFanta($root, meta);
	declareCSSVars(photoMeta);
	log({
		type: Snaps.Composite,
		state: 'ready',
	});
};

export default go;
