import * as ipc from '../ipc';
import getFileInArchive from './getFileInArchive';

export default async function getFileInArchiveAsBase64 (file, archive): Promise<string> {
	const data: ArrayBuffer = await getFileInArchive(file, archive);
	const buff = Buffer.from(data);
	return buff.toString('base64');
}
