import IpcProcess from './IpcProcess';

export default class IpcSubordinate extends IpcProcess {
	
	protected proc: Electron.IpcMain;
	protected webContents: Electron.WebContents;
	public constructor(proc: Electron.IpcMain, webContents: Electron.WebContents) {
		super();
		this.proc = proc;
		this.webContents = webContents;
	}
	
	protected _doSend(channel: string, ...args: any[]) {
		this.webContents.send(channel, ...args);
	}
	
	protected _doListen<TArgs extends any[]>(channel: string, callback: IpcProcess_Callback<TArgs>) {
		this.proc.on(channel, (e, ...args: TArgs) => { callback(...args) });
	}
	
	protected _doRun<T>(channel: string, ...args: any[]): Promise<T> {
		throw new Error('IpcSubordinate class does not run tasks.');
	}
	
	protected _doHandle<TArgs extends any[]>(channel: string, callback: IpcProcess_Callback<TArgs>) {
		this.proc.handle(channel, (e, ...args: TArgs) => { callback(...args); });
	}
}
