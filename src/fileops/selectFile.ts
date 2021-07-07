import * as ipc from '../ipc';

export default async function selectFile(allowedExtensions) {
	if (!allowedExtensions) allowedExtensions = ['*']
	return await ipc.runTask('main', 'io.file-select', [allowedExtensions]);
}
