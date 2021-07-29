import * as ipc from '../ipc';
import getFile from './getFile';

export default async function getFileAsText (file): Promise<string> {
	let data: ArrayBuffer = await getFile(file);
	let view = new Uint8Array(data);
	let decoder = new TextDecoder();
	return decoder.decode(view);
}
