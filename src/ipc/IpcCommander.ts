import IpcProcess from './IpcProcess';
import { PreloadRegistry } from '../util';

export default class IpcCommander extends IpcProcess {
	private static instance: IpcCommander;
	public static getInstance(): IpcCommander {
		if (!this.instance) {
			this.instance = new IpcCommander(
				PreloadRegistry.getInstance().get<Electron.IpcRenderer>('ipcRenderer')
			);
		}
		return this.instance;
	}
	
	protected proc: Electron.IpcRenderer;
	private constructor(proc: Electron.IpcRenderer) {
		super();
		this.proc = proc;
	}
	
	protected _doSend(channel: string, ...args: any[]) {
		this.proc.send(channel, ...args);
	}
	
	protected _doListen<TArgs extends any[]>(channel: string, callback: IpcProcess_Callback<TArgs>) {
		this.proc.on(channel, (e, ...args: TArgs) => { callback(...args); });
	}
	
	protected _doRun<TRet, TArgs extends any[]>(channel: string, ...args: TArgs): Promise<TRet> {
		return new Promise<TRet>(async (resolve, reject) => {
			let ret = await this.proc.invoke(channel, ...args);
			resolve(ret as TRet);
		});
	}
	
	protected _doHandle<TArgs extends any[]>(channel: string, callback: IpcProcess_Callback<TArgs>) {
		throw new Error('IpcCommander class does not handle tasks.');
	}
}
