interface ElectronWindow extends Window {
	__preloadRegistry: PreloadRegistry;
}

export default class PreloadRegistry {
	private _params: {} = {};
	private _locked: boolean = false;
	
	public static getInstance(): PreloadRegistry {
		const g = ((global || window) as unknown) as ElectronWindow;
		if (!g.__preloadRegistry) {
			g.__preloadRegistry = new PreloadRegistry();
		}
		return g.__preloadRegistry;
	}
	
	public static removeInstance() {
		const g = ((global || window) as unknown) as ElectronWindow;
		delete g.__preloadRegistry;
	}
	
	protected constructor() {};
	
	public register(name: string, val: any) {
		if (this._locked) {
			throw new Error('Preload registry has been locked.');
		}
		this._params[name] = val;
	}
	
	public get<T>(name: string): T {
		return this._params[name] as T;
	}
	
	public lock() {
		this._locked = true;
	}
}
