import { PreloadRegistry } from '../util';
import IpcConfig from './IpcConfig';

export default function handleEvent(id, channel, callback) {
	if (id == 'main') {
		const ipcConfig = IpcConfig.getInstance();
		// validate
		ipcConfig.checkChannelName(channel);
		ipcConfig.checkChannelType(channel, 'message');

		PreloadRegistry.getInstance().get<Electron.IpcRenderer>('ipcRenderer').on(channel, (e, ...args) => {
			callback(...args);
		});
	}
	else {
		throw new Error('Process id ' + id + ' is not recognized.');
	}
}
