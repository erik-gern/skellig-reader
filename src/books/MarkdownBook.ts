import * as marked from 'marked';
import { getFileAsText } from '../fileops';
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
		this.markdown = await getFileAsText(this.filePath);	
	}
	
	async renderHtml(): Promise<SanitizedHtmlWrapper> {
		const htmlStrDirty = marked(this.markdown);
		const htmlStrClean = await SanitizedHtmlWrapper.create(htmlStrDirty)
		return htmlStrClean;
	}
	
	getCoverFile(): string {
		return '';
	}
}