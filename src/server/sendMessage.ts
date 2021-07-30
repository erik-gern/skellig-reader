import IpcConfig from '../ipc/IpcConfig';

export default function sendMessage(recipient: Electron.WebContents, channel: string, data: any): void {
	const ipcConfig = IpcConfig.getInstance();
	ipcConfig.checkChannelName(channel);
	recipient.send(channel, data);
}