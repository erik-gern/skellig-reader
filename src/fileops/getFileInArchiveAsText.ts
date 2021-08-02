import * as ipc from '../ipc';
import getFileInArchive from './getFileInArchive';

export default async function getFileInArchiveAsText (file, archive): Promise<string> {
	const data: ArrayBuffer = await getFileInArchive(file, archive);
	const view = new Uint8Array(data);
	const decoder = new TextDecoder();
	return decoder.decode(view);
}
