import { BrowserWindow } from 'electron';

interface BrowserWindow_WebPreferences {
	nodeIntegration: boolean;
	contextIsolation: boolean;
	preload?: string;
}

export default function createWindow(index: string, width: number, height: number, preload?: string): BrowserWindow {
	const webPreferences: BrowserWindow_WebPreferences = {
		nodeIntegration: false,
		contextIsolation: false,
	};
	if (preload) {
		webPreferences.preload = preload;
	}
	const win = new BrowserWindow({
		width,
		height,
		webPreferences,
	});
	win.loadFile(index);
	return win;
}
