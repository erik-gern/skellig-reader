import * as ipc from '../ipc';

export default async function getFile (file, asBase64=false) {
	return await ipc.runTask('main', 'io.file-read', [file, asBase64]);
}
