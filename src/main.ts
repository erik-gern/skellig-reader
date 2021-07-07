import * as fs from 'fs';
import { promisify } from 'util';
import {
	app,
	BrowserWindow,
	ipcMain,
	dialog,
	Menu,
} from 'electron';
import { 
	getArchiveInfo,
	getFileInArchive,
} from './server';

let mainWindow;

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

ipcMain.handle('process.details', async (event) => {
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

ipcMain.handle('menu.create', (event, template: MenuTemplate) => {
	const translateTemplate = (menu: MenuTemplate) => {
		menu.forEach((item: MenuTemplateItem, i: number) => {
			// add app name to label
			if (item.label) {
				item.label = item.label.replace('[APP_NAME]', app.name);
			}
			// add event handling to menu items with id and without a role
			if (item.id && !item.role) {
				const eventName = 'menu.trigger.' + item.id;
				item.click = (_a, _b, _c) => {
					event.sender.send(eventName);
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

ipcMain.handle('io.file-select', async (event, allowedExtensions) => {
	const ret = await dialog.showOpenDialog(mainWindow, {
		title: 'Open a Book File',
		filters: [
			{ name: 'Files', extensions: allowedExtensions},
		],
		properties: ["openFile"],
	});
	return ret.filePaths;
});

const readFilePromise = promisify(fs.readFile);
ipcMain.handle('io.file-read', async (event, file, asBase64) => {
	const data = await readFilePromise(file);
	return data.toString(asBase64 ? 'base64' : 'utf-8');
});

ipcMain.handle('io.archive-list', async (event, archivePath) => {
	return await getArchiveInfo(archivePath);
});

ipcMain.handle('io.archive-file-read', async (event, file, archivePath, asBase64) => {
	return await getFileInArchive(file, archivePath, asBase64);
});
