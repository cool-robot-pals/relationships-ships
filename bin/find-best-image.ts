require('@tensorflow/tfjs-node');
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';
import Fantarc from '../.fantarc';
import { buildLogger, Realm } from './help/logger';
const { logOngoing, logError } = buildLogger(Realm.Tensor);

const fs = require('fs');

const { Canvas, Image, ImageData } = canvas;
//@ts-ignore
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
const getFaces = async (photo: string) => {
	const img = await canvas.loadImage(photo);
	await faceapi.nets.ssdMobilenetv1.loadFromDisk(
		__dirname + '/../assets/weights'
	);
	//@ts-ignore
	return await faceapi.detectSingleFace(img);
};

interface PhotoMeta {
	score: number;
	box: faceapi.Box;
	path: string;
}

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
					box: f?.box,
					path,
				};
			});
		})
	);

	const best = detections
		.filter((_) => _.score)
		.sort((a, b) => b.score - a.score)
		.shift();

	if (!best) {
		logError('Failed to find a face!!');
		throw false;
	}

	return best as PhotoMeta;
};

export const writePhotos = (meta: PhotoMeta) => {
	fs.writeFileSync(Fantarc.paths.photoMeta, JSON.stringify(meta));
};

if (!module.parent) {
	getBestPhoto().then(writePhotos);
}
