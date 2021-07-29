import * as ipc from '../ipc';

export default async function getFile (file): Promise<ArrayBuffer> {
	return await ipc.runTask('main', 'io.file-read', [file]);
}
