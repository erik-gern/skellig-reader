import * as ipc from '../ipc';

export default async function getArchiveInfo (archivePath) {
	return await ipc.runTask('main', 'io.archive-list', [archivePath]);
}
