import { PreloadRegistry } from '../util';
import IpcConfig from './IpcConfig';

export default function runTask(id, channel, args): Promise<any> {
	if (id == 'main') {
		const ipcConfig = IpcConfig.getInstance();
		// validate
		ipcConfig.checkChannelName(channel);
		ipcConfig.checkChannelType(channel, 'task');
		ipcConfig.checkChannelArgs(channel, args);
		
		return new Promise((resolve, reject) => {
			let invokeArgs = args.slice();
			invokeArgs.unshift(channel);
			let ipcRenderer: Electron.IpcRenderer = PreloadRegistry.getInstance().get<Electron.IpcRenderer>('ipcRenderer');
			ipcRenderer.invoke.apply(ipcRenderer, invokeArgs).then(function(ret){
				resolve(ret);
			});
		});
	}
	else {
		throw new Error('Process id ' + id + ' is not recognized.'); 
	}
}
