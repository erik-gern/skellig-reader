require('module-alias/register');

import * as fs from 'fs';
import { promisify } from 'util';
import { app, BrowserWindow, dialog, Menu } from 'electron';
import * as yaml from 'js-yaml';
import { getArchiveInfo, getFileDataInArchive, getFileData, handleTask } from './server';
import { IpcConfig } from './ipc';

let mainWindow;

// set ipc spec
const ipcSpec = yaml.load(fs.readFileSync(__dirname + '/ipc/ipc-spec.yaml', 'utf-8'));
IpcConfig.getInstance().set(ipcSpec);

function createWindow () {
	mainWindow = new BrowserWindow({
		width: 1000,
		height: 800,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: false,
			preload: __dirname + '/../build/preload.js',
		},
	});
	mainWindow.loadFile('build/index.html');
}

app.whenReady().then(() => {
	createWindow();
	console.log(mainWindow);
	app.on('activate', function(){
		if (BrowserWindow.getAllWindows().length == 0) {
			createWindow();
		}
	});
});

app.on('window-all-closed', function(){
	app.quit();
});

handleTask('process.details', async (event) => {
	const details = {
		app: {
			name: app.name,
		},
		process: {
			platform: process.platform,
		},
	};
	return details;
});

handleTask('menu.create', (event, template: MenuTemplate) => {
	const translateTemplate = (menu: MenuTemplate) => {
		menu.forEach((item: MenuTemplateItem, i: number) => {
			// add app name to label
			if (item.label) {
				item.label = item.label.replace('[APP_NAME]', app.name);
			}
			// add event handling to menu items with id and without a role
			if (item.id && !item.role) {
				const eventName = 'menu.trigger';
				item.click = (_a, _b, _c) => {
					event.sender.send(eventName, item.id);
				}
			}
			// translate submenus recursively
			if (item.submenu) {
				translateTemplate(item.submenu);
			}
		});
	};
	translateTemplate(template);
	const menu: Electron.Menu = Menu.buildFromTemplate((template as unknown) as Electron.MenuItemConstructorOptions[]);
	Menu.setApplicationMenu(menu);
});

handleTask('io.file-select', async (event, allowedExtensions) => {
	const ret = await dialog.showOpenDialog(mainWindow, {
		title: 'Open a Book File',
		filters: [
			{ name: 'Files', extensions: allowedExtensions},
		],
		properties: ["openFile"],
	});
	return ret.filePaths;
});

handleTask('io.file-read', async (event, file) => {
	return await getFileData(file);
});

handleTask('io.archive-list', async (event, archivePath) => {
	return await getArchiveInfo(archivePath);
});

handleTask('io.archive-file-read', async (event, file, archivePath) => {
	return await getFileDataInArchive(file, archivePath);
});
