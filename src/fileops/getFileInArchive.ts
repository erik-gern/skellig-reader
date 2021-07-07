import * as ipc from '../ipc';

export default async function getFileInArchive (file, archive, asBase64=false) {
	return await ipc.runTask('main', 'io.archive-file-read', [file, archive, asBase64]);
}
