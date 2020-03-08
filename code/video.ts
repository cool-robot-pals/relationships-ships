import { injectCSS } from './help/css-vars';
import { log } from './help/logger';
import { Meta, Ship, Snaps } from './help/types';
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
	let firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore($tag, firstScriptTag);

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
							duration * 0.2 + (duration / 0.65) * Math.random() - 1
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
	declareCSSVars();
	setTimeout(() => {
		log({
			type: Snaps.Video,
			state: 'ready',
		});
	}, 1000);
	await makePlayer(data.ship);
};
go();
