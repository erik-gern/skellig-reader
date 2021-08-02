require('module-alias/register');

import { promises } from 'fs';
import { app, BrowserWindow } from 'electron';
import * as yaml from 'js-yaml';
import * as server from './server';
import { IpcConfig } from './ipc';

main();

async function main() {
	// set ipc spec
	const ipcSpec = yaml.load(await promises.readFile(__dirname + '/ipc/ipc-spec.yaml', 'utf-8'));
	IpcConfig.getInstance().set(ipcSpec);

	let mainWindow: Electron.BrowserWindow;
	app.whenReady().then(() => {
		server.ensureWindowCreation(() => {
			mainWindow = server.createWindow(
				__dirname + '/../build/index.html',
				1000,
				800,
				__dirname + '/../build/preload.js'
			);	
		});
	});

	app.on('window-all-closed', function(){
		app.quit();
	});

	server.handleTask('process.details', async (event) => {
		return server.getProcessDetails();
	});

	server.handleTask('menu.create', (event, template: Electron.MenuItemConstructorOptions[]) => {
		server.createApplicationMenu(event.sender, template);
	})

	server.handleTask('io.file-select', async (event, allowedExtensions) => {
		return await server.selectFiles(mainWindow, 'Open a Book File', allowedExtensions);
	});

	server.handleTask('io.file-read', async (event, file) => {
		return await server.getFileData(file);
	});

	server.handleTask('io.archive-list', async (event, archivePath) => {
		return await server.getArchiveInfo(archivePath);
	});

	server.handleTask('io.archive-file-read', async (event, file, archivePath) => {
		return await server.getFileDataInArchive(file, archivePath);
	});
}