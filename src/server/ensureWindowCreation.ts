import { app, BrowserWindow } from 'electron';

export default function ensureWindowCreation (construct: Function) {
	construct();
	app.on('activate', function(){
		if (BrowserWindow.getAllWindows().length == 0) {
			construct();
		}
	});
}