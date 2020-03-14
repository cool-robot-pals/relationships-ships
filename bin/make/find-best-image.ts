require('@tensorflow/tfjs-node');
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';
import Fantarc from '../../.fantarc';
import { buildLogger, Realm } from '../help/logger';
import { PhotoMeta } from '../../code/help/types';
const { logOngoing, logError, log } = buildLogger(Realm.Tensor);

const fs = require('fs');
const randomArrKey = <T>(items: T[]): T =>
	items[Math.floor(Math.random() * items.length)];

const { Canvas, Image, ImageData } = canvas;
//@ts-ignore
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
const getFaces = async (photo: string) => {
	const img = await canvas.loadImage(photo);
	await faceapi.nets.ssdMobilenetv1.loadFromDisk(
		__dirname + '/../../assets/weights'
	);
	//@ts-ignore
	return await faceapi.detectSingleFace(img);
};
export const getBestPhoto = async (): Promise<PhotoMeta> => {
	const detections: Partial<PhotoMeta>[] = await Promise.all(
		Fantarc.paths.videoCaptures().map((path) => {
			const logOnDone = logOngoing(
				`detecting faces in ${path.split('/').pop()}`
			);
			return getFaces(path).then((f) => {
				logOnDone();
				return {
					score: f?.score,
					box: f &&
						f.box && {
							x: f.box.x,
							y: f.box.y,
							width: f.box.width,
							height: f.box.height,
						},
					path,
				};
			});
		})
	);

	const best = randomArrKey(detections.filter((_) => _.score));

	if (!best) {
		logError('Failed to find a face!!');
		return {
			path: randomArrKey(detections).path,
			score: -1,
			box: {
				width: 100,
				height: 100,
				x: 720 / 2,
				y: 1280 / 2,
			},
		};
	}

	log(`${best.path} won`);

	return best as PhotoMeta;
};

export const writePhotos = (meta: PhotoMeta) => {
	fs.writeFileSync(Fantarc.paths.photoMeta, JSON.stringify(meta));
};

const def = () => getBestPhoto().then(writePhotos);
export default def;
if (!module.parent) {
	def();
}
