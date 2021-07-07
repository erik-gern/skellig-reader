import { PreloadRegistry } from '../util';

export default function runTask(id, name, args): Promise<any> {
	if (id == 'main') {
		return new Promise((resolve, reject) => {
			let invokeArgs = args.slice();
			invokeArgs.unshift(name);
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
