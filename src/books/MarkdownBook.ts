import * as marked from 'marked';
import { getFile } from '../fileops';
import { SanitizedHtmlWrapper } from '../xml';
import Book from './Book';

export default class MarkdownBook extends Book {
	markdown: string;
	filePath: string;
	
	constructor(filePath) {
		super();
		this.filePath = filePath;
	}
	
	async load(): Promise<void> {
		this.markdown = await getFile(this.filePath);	
	}
	
	async renderHtml(): Promise<SanitizedHtmlWrapper> {
		let htmlStrDirty = marked(this.markdown);
		let htmlStrClean = await SanitizedHtmlWrapper.create(htmlStrDirty)
		return htmlStrClean;
	}
	
	getCoverFile(): string {
		return '';
	}
}