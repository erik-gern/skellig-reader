export default abstract class IpcProcess {
	protected config: IpcProcess_Config;
	
	public setConfig(config: IpcProcess_Config) {
		this.config = config;
	}
	
	protected abstract _doSend(channel: string, ...args: any[]);
	protected abstract _doListen<TArgs extends any[]>(channel: string, callback: IpcProcess_Callback<TArgs>);
	protected abstract _doRun<TRet, TArgs extends any[]>(channel: string, ...args: TArgs): Promise<TRet>;
	protected abstract _doHandle<TArgs extends any[]>(channel: string, callback: IpcProcess_Callback<TArgs>);
	
	protected getType(val: any) {
		// special checks
		if (val === null) {
			return 'null';
		}
		
		// try typeof first
		let t = (typeof val).toLowerCase();
		
		// if object, get its constructor
		if (t === 'object' && val.constructor) {
			t = val.constructor.name;
		}
		
		// lowercase vanilla object and array types
		if (t == 'Object' || t == 'Array') {
			t = t.toLowerCase();
		}
		return t;
	}
	
	protected checkChannelName(channel: string) {
		if (!this.config[channel]) {
			throw new Error(`No channel configured for '${channel}'`);
		}
	}
	
	protected checkChannelArgs(channel, args: any[]) {
		let channelConfig = this.config[channel];
		if (args.length > channelConfig.args.length) {
			throw new Error(
				`Encountered too many arguments for channel '${channel} (expected ${channelConfig.args.length}, got ${args.length})'`
			);
		}
		else if (args.length < channelConfig.args.length) {
			throw new Error(
				`Encountered too few arguments for channel '${channel} (expected ${channelConfig.args.length}, got ${args.length})'`
			);
		}
		for (let i = 0; i < args.length; i++) {
			let thisArgType = this.getType(args[i]);
			let expectedArgType = channelConfig.args[i];
			if (thisArgType != expectedArgType) {
				throw new Error(`Argument at position ${i} must be type '${expectedArgType}', '${thisArgType}'' encountered instead`)
			}
		}	
	}
	
	protected checkChannelType(channel: string, type: string) {
		let expectedType = this.config[channel].type;
		if (expectedType != type) {
			throw new Error(`Expected type '${expectedType}' for channel '${channel}', got '${type}' instead`);
		}
	}

	protected checkChannelRet(channel: string, ret: any) {
		let retType = this.getType(ret);
		let expectedRetType = this.config[channel].ret;
		if (expectedRetType != retType) {
			throw new Error(`Expected return type '${expectedRetType}' for channel '${channel}', got '${retType}' instead`);
		}
	}

	public send(channel: string, ...args: any[]) {
		this.checkChannelName(channel);
		this.checkChannelType(channel, 'event');
		this.checkChannelArgs(channel, args);
		this._doSend(channel, ...args);
	}
	
	public listen<TArgs extends any[]>(channel: string, callback: IpcProcess_Callback<TArgs>) {
		this.checkChannelName(channel);
		this.checkChannelType(channel, 'event');
		this._doListen<TArgs>(channel, callback);
	}
	
	public async run<TRet, TArgs extends any[]>(channel: string, ...args: TArgs): Promise<TRet> {
		this.checkChannelName(channel);
		this.checkChannelType(channel, 'task');
		this.checkChannelArgs(channel, args);
		let ret = await this._doRun<TRet, TArgs>(channel, ...args);
		this.checkChannelRet(channel, ret);
		return ret as TRet;
	}
	
	public handle<TArgs extends any[]>(channel: string, callback: IpcProcess_Callback<TArgs>) {
		this.checkChannelName(channel);
		this.checkChannelType(channel, 'task');
		this._doHandle<TArgs>(channel, callback);
	}
}