import { dialog } from 'electron';

export default async function selectFiles (
	win: Electron.BrowserWindow,
	title: string,
	allowedExtensions: string[]
): Promise<string[]> {
	const ret = await dialog.showOpenDialog(win, {
		title: title,
		filters: [
			{ name: 'Files', extensions: allowedExtensions},
		],
		properties: ["openFile"],
	});
	return ret.filePaths;
}