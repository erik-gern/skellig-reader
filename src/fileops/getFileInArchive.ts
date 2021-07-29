import * as ipc from '../ipc';

export default async function getFileInArchive (file, archive): Promise<ArrayBuffer> {
	return await ipc.runTask('main', 'io.archive-file-read', [file, archive]);
}
