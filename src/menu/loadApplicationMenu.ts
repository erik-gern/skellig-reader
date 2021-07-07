import * as ipc from '../ipc';

export default async function loadApplicationMenu(template: MenuTemplate) {
	await ipc.runTask('main', 'menu.create', [template]);
}
