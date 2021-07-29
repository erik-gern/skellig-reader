import * as ipc from '../ipc';
import getFileInArchive from './getFileInArchive';

export default async function getFileInArchiveAsBase64 (file, archive): Promise<string> {
	let data: ArrayBuffer = await getFileInArchive(file, archive);
	let buff = Buffer.from(data);
	return buff.toString('base64');
}
