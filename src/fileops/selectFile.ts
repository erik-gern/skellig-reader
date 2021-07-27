import * as ipc from '../ipc';

export default async function selectFile(allowedExtensions): Promise<string[]> {
	if (!allowedExtensions) allowedExtensions = ['*']
	return await (ipc.runTask('main', 'io.file-select', [allowedExtensions]) as Promise<string[]>);
}
