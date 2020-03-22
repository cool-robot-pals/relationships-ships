import { injectCSS } from '../help/css-vars';
import { log } from '../help/logger';
import { Meta, Ship, Snaps } from '../help/types';
const data = require('../dest/meta.json') as Meta;

const [VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_V_OFFSET] = [1280, 720, 120];

const randomArrKey = <T>(items: T[]): T =>
	items[Math.floor(Math.random() * items.length)];

declare global {
	interface Window {
		onYouTubeIframeAPIReady: any;
		YT: any;
	}
}

const makePlayer = (ship: Ship) => {
	let player;
	let seekedTo = false;

	const $tag = document.createElement('script');

	$tag.src = 'https://www.youtube.com/iframe_api';
	document.body.appendChild($tag);

	return new Promise((yay) => {
		window.onYouTubeIframeAPIReady = () => {
			player = new window.YT.Player('player', {
				videoId: randomArrKey(ship.vids),
				width: VIDEO_WIDTH,
				height: VIDEO_HEIGHT + VIDEO_V_OFFSET * 2,
				origin: window.location.href,
				playerVars: {
					enablejsapi: 1,
					controls: 0,
					modestbranding: 1,
					mute: 1,
					rel: 0,
					showinfo: 0,
					autoplay: 0,
					cc_load_policy: 0,
				},
				events: {
					onReady: () => {
						player.playVideo();
					},
					onStateChange: (event) => {
						if (event.data == window.YT.PlayerState.PLAYING) {
							if (seekedTo) {
								setTimeout(() => {
									yay();
								}, 100);
							} else {
								seekedTo = true;
								const duration = player.getDuration();
								player.seekTo(duration * 0.2 + duration * 0.65 * Math.random());
							}
						}
					},
				},
			});
		};
	});
};

const declareCSSVars = () => {
	injectCSS({
		width: VIDEO_WIDTH,
		height: VIDEO_HEIGHT,
		videooffset: VIDEO_V_OFFSET,
	});
};

const go = async () => {
	document.body.innerHTML = '<div id="player"></div>';
	declareCSSVars();
	await makePlayer(data.ship);
	log({
		type: Snaps.Video,
		state: 'ready',
	});
};

export default go;
