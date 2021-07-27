import * as ipc from '../ipc';

export default function onMenuTrigger(id: string | number, callback: Function) {
	ipc.handleEvent('main', 'menu.trigger', (eventId: string) => {
		if (eventId == id) {
			callback();
		}
	});
}
