import { parse } from './help/parser';
import { bend } from './help/gender';
import { Post, Ship, Gender } from './t/types';
import ships from '../assets/ships';

const data = require('../data/controversials.json');
const posts = parse(data);

interface Data {
	post: Post;
	ship: Ship;
}

const [VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_V_OFFSET] = [1280, 720, 120];

const randomArrKey = <T>(items: T[]): T =>
	items[Math.floor(Math.random() * items.length)];

const buildUpFanta = ($root, { post }: Data) => {
	$root.innerHTML = `<h2>${post.title}</h2><p>${post.selftext}</p>`;

	const tweet = [post.title];

	return { tweet };
};

declare global {
	interface Window {
		onYouTubeIframeAPIReady: any;
		YT: any;
	}
}

const makePlayer = ({ ship }: Data) => {
	let player;
	let seekedTo = false;

	return new Promise((yay) => {
		window.onYouTubeIframeAPIReady = () => {
			player = new window.YT.Player('player', {
				videoId: randomArrKey(ship.vids),
				width: VIDEO_WIDTH,
				height: VIDEO_HEIGHT + VIDEO_V_OFFSET * 2,
				enablejsapi: 1,
				playerVars: {
					controls: 0,
					modestbranding: 1,
					mute: 1,
					origin: window.location.href,
					rel: 0,
					showinfo: 0,
					autoplay: 0,
					cc_load_policy: 0,
				},
				events: {
					onReady: () => {
						seekedTo = true;
						const duration = player.getDuration();
						player.seekTo(
							duration * 0.1 + (duration / 0.8) * Math.random() - 1
						);
					},
					onStateChange: (event) => {
						if (seekedTo && event.data == window.YT.PlayerState.PLAYING) {
							setTimeout(() => {
								yay();
							}, 100);
						}
					},
				},
			});
		};

		const $tag = document.createElement('script');
		$tag.src = 'https://www.youtube.com/iframe_api';
		document.body.appendChild($tag);
	});
};

const declareCSSVars = () => {
	const [width, height, videooffset] = [
		VIDEO_WIDTH,
		VIDEO_HEIGHT,
		VIDEO_V_OFFSET,
	];
	const [boxwidth, boxheight] = [420, 200].map(
		(val) => val * 0.9 + Math.random() * (val * 0.2)
	);
	const [boxleft, boxtop] = [width - boxwidth, height - boxheight].map(
		(v) => v * 0.8 * Math.random()
	);

	const all = {
		width,
		height,
		boxheight,
		boxwidth,
		boxleft,
		boxtop,
		videooffset,
	};
	for (let [key, val] of Object.entries(all)) {
		document.documentElement.style.setProperty(
			'--' + key,
			Math.round(val) + 'px'
		);
	}
};

const go = async () => {
	const $root = document.querySelector('x-ship');
	const ship = randomArrKey(ships);
	let post = randomArrKey(posts);
	if (ship.bend) {
		post = bend(post, ship.bend);
	}
	const data = buildUpFanta($root, { post, ship });
	declareCSSVars();
	await makePlayer({ post, ship });
	console.log(JSON.stringify(data));
};
go();
