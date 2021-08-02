import * as ipc from '../ipc';
import getFile from './getFile';

export default async function getFileAsText (file): Promise<string> {
	const data: ArrayBuffer = await getFile(file);
	const view = new Uint8Array(data);
	const decoder = new TextDecoder();
	return decoder.decode(view);
}
