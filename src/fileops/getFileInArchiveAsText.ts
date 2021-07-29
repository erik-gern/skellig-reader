import * as ipc from '../ipc';
import getFileInArchive from './getFileInArchive';

export default async function getFileInArchiveAsText (file, archive): Promise<string> {
	let data: ArrayBuffer = await getFileInArchive(file, archive);
	let view = new Uint8Array(data);
	let decoder = new TextDecoder();
	return decoder.decode(view);
}
