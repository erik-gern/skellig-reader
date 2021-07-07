type IpcProcess_Callback<TArgs extends any[]> = (...args: TArgs) => {};

type IpcProcess_Primitive = 'string' | 'number' | 'object' | 'array' | 'boolean' | 'null';

type IpcProcess_ConfigType = 'task' | 'event';

type IpcProcess_ConfigDirection = 'up' | 'down' | 'both';

interface IpcProcess_ConfigOptionArgs {
	[index: number]: IpcProcess_Primitive;
	length: number;
}

interface IpcProcess_ConfigOption {
	type: IpcProcess_ConfigType;
	dir?: IpcProcess_ConfigDirection;
	args?: IpcProcess_ConfigOptionArgs;
	ret?: IpcProcess_Primitive;
}

interface IpcProcess_Config {
	[channel: string]: IpcProcess_ConfigOption;
}
