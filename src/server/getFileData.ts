import { readFile } from 'fs';
import { promisify } from 'util';

const readFilePromise = promisify(readFile);

export default function getFileData(file: string): Promise<ArrayBuffer> {
	return new Promise<ArrayBuffer>((resolve, reject) => {
		readFilePromise(file).then((data: ArrayBuffer) => {
			resolve(data);
		}, (e) => {
			reject(e);
		});
	});
}