import { Menu, app } from 'electron';
import sendMessage from './sendMessage';

function translateTemplate (renderer: Electron.WebContents, menu: Electron.MenuItemConstructorOptions[]) {
	menu.forEach((item: Electron.MenuItemConstructorOptions, i: number) => {
		// add app name to label
		if (item.label) {
			item.label = item.label.replace('[APP_NAME]', app.name);
		}
		// add event handling to menu items with id and without a role
		if (item.id && !item.role) {
			item.click = (_a, _b, _c) => {
				sendMessage(renderer, 'menu.trigger', item.id);
			}
		}
		// translate submenus recursively
		if (item.submenu) {
			translateTemplate(renderer, item.submenu as Electron.MenuItemConstructorOptions[]);
		}
	});
};

export default function createApplicationMenu(
	renderer: Electron.WebContents,
	template: Electron.MenuItemConstructorOptions[]
): Electron.Menu {
	translateTemplate(renderer, template);
	const menu: Electron.Menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
	return menu;
}