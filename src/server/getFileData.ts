import { promises } from 'fs';

export default function getFileData(file: string): Promise<ArrayBuffer> {
	return new Promise<ArrayBuffer>((resolve, reject) => {
		promises.readFile(file).then((data: ArrayBuffer) => {
			resolve(data);
		}, (e) => {
			reject(e);
		});
	});
}