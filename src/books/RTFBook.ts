import { RTFJS } from 'rtf.js';
import { getFile } from '../fileops';
import { SanitizedHtmlWrapper } from '../xml';
import Book from './Book';

export default class RTFBook extends Book {
	data: ArrayBuffer;
	filePath: string;
	
	constructor(filePath) {
		super();
		this.filePath = filePath;
	}
	
	async load(): Promise<void> {
		this.data = await getFile(this.filePath);
	}
	
	async renderHtml(): Promise<SanitizedHtmlWrapper> {
		let doc = new RTFJS.Document(this.data, {});
		let htmlElements: HTMLElement[] = await doc.render();
		let htmlStrDirty: string = htmlElements.map((e) => { return e.outerHTML; }).join('');
		let htmlStrClean = await SanitizedHtmlWrapper.create(htmlStrDirty)
		return htmlStrClean;
	}
	
	getCoverFile(): string {
		return '';
	}
}