import { PreloadRegistry } from '../util';

export default function handleEvent(id, name, callback) {
	if (id == 'main') {
		PreloadRegistry.getInstance().get<Electron.IpcRenderer>('ipcRenderer').on(name, (e, ...args) => {
			callback(...args);
		});
	}
	else {
		throw new Error('Process id ' + id + ' is not recognized.');
	}
}
