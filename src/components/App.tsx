import { createBook } from '../books';
import { selectFile } from '../fileops';
import { isMacOS } from '../util';
import { loadApplicationMenu, onMenuTrigger } from '../menu';
import BookViewer from './BookViewer';
import * as React from 'react';

const menuTemplate: MenuTemplate = [
	// mac-only application menu
	...(isMacOS() ? [{
		'label': '[APP_NAME]',
		submenu: [
			{ role: 'about' },
			{ type: 'separator' },
			{ role: 'quit' },
		],
	}] : []),
	// file menu
	{
		'label': 'File',
		submenu: [
			{ 
				label: 'Open Book...', 
				id: 'open',
				accelerator: 'CmdOrCtrl+O',
				registerAccelerator: true,
			},
			isMacOS() ? { role: 'close' } : { role: 'quit' }
		],
	},
	{
		label: 'View',
		submenu: [
			{
				label: 'Previous Page',
				id: 'previous-page',
				accelerator: 'Left',
				registerAccelerator: true,
				enabled: true,
			},
			{
				label: 'Next Page',
				id: 'next-page',
				accelerator: 'Right',
				registerAccelerator: true,
				enabled: true,
			},
		],	
	},
	{
		'label': 'Debug',
		submenu: [
			{ role: 'toggleDevTools' },
		],
	},
	{
		'label': 'Help',
		submenu: [
			...(!isMacOS() ? [{ role: 'about' }] : []),
		],
	},
];

export default class App extends React.Component {
	state = {
		book: null,
		pageHtml: null,
	}
	
	constructor(props) {
		super(props);
		this.onOpenClick = this.onOpenClick.bind(this);
	}
	
	async componentDidMount() {
		await loadApplicationMenu(menuTemplate);
		onMenuTrigger('open', () => {
			this.openBook();
		});
	}
	
	render() {
		return (
			<div>
				{!this.state.book 
					?
					<div className="menu">
						<a id="button-open" 
							className="button" 
							href="#"
							onClick={this.onOpenClick}
						>Open</a>
					</div>
					:
					<BookViewer book={this.state.book} />
				}
			</div>
		);
	}

	async onOpenClick(e) {
		e.preventDefault();
		await this.openBook();
	}
	
	async openBook() {
		try {
			const bookFiles = await selectFile(['epub', 'md', 'txt', 'rtf']);
			if (bookFiles.length == 0) {
				return;
			}
			const book = await createBook(bookFiles[0]);
			this.setState({book});
		}
		catch (e) {
			window.alert(e.message);
			return;
		}		
	}
	
}
