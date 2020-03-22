import fetchMeta from './make/fetch-meta';
import screenVideo from './make/screen-video';
import findBestImage from './make/find-best-image';
import screenFinal from './make/screen-final';

const main = async () => {
	await fetchMeta();
	await screenVideo();
	await findBestImage();
	await screenFinal();
	process.exit(0);
};

main();
