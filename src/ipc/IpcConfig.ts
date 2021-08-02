export default class IpcConfig {
	private static instance: IpcConfig;
	public static getInstance(): IpcConfig {
		if (!this.instance) {
			this.instance = new IpcConfig();
		}
		return this.instance;
	}
	
	private config: IpcProcess_Config;
	private constructor() {}
	public set(config: IpcProcess_Config) {
		this.config = config;
	}

	public getType(val: any) {
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
	
	public checkChannelName(channel: string) {
		if (!this.config[channel]) {
			throw new Error(`No channel configured for '${channel}'`);
		}
	}
	
	public checkChannelArgs(channel, args: any[]) {
		const channelConfig = this.config[channel];
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
			const thisArgType = this.getType(args[i]).replace(/\?/gi, '');
			const expectedArgType = channelConfig.args[i];
			if (thisArgType != expectedArgType) {
				throw new Error(`Argument at position ${i} must be type '${expectedArgType}', '${thisArgType}'' encountered instead`)
			}
		}	
	}
	
	public checkChannelType(channel: string, type: string) {
		const expectedType = this.config[channel].type;
		if (expectedType != type) {
			throw new Error(`Expected type '${expectedType}' for channel '${channel}', got '${type}' instead`);
		}
	}

	public checkChannelRet(channel: string, ret: any) {
		const retType = this.getType(ret).replace(/\?/gi, '');
		const expectedRetType = this.config[channel].ret;
		if (expectedRetType != retType) {
			throw new Error(`Expected return type '${expectedRetType}' for channel '${channel}', got '${retType}' instead`);
		}
	}

}