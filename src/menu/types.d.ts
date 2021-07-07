interface MenuTemplateItem {
	id?: string | number;
	label?: string;
	click?: Function;
	role?: string;
	submenu?: MenuTemplateItem[];
	accelerator?: string;
	type?: string;
	registerAccelerator?: boolean;
	enabled?: boolean;
	visible?: boolean;
}
type MenuTemplate = MenuTemplateItem[];
