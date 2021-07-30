import { ipcMain } from 'electron';
import IpcConfig from '../ipc/IpcConfig';

type IpcMain_TaskCallback = (event, ...args) => (Promise<any> | void);

export default function handleTask (channel: string, callback: IpcMain_TaskCallback): void {
	const ipcConfig = IpcConfig.getInstance();
	ipcConfig.checkChannelName(channel);
	ipcMain.handle(channel, (event, ...args) => {
		ipcConfig.checkChannelArgs(channel, args);
		return callback(event, ...args);
	});
}
