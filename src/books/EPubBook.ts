import { getArchiveInfo, getFileInArchiveAsBase64, getFileInArchiveAsText } from '../fileops';
import { parseXml, parseHtml, SanitizedHtmlWrapper } from '../xml';
import Book from './Book';

export default class EPubBook extends Book {
	pages: number;
	archivePath: string;
	archiveFiles: string[];
	
	containerXmlFile: string;
	containerXml: Element;
	
	contentOpfFile: string;
	contentOpf: Element;

	contentFolder: string;

	tocNcxFile: string;
	tocNcx: Element;
	
	contentFiles: string[];
	
	constructor(archivePath: string) {
		super();
		this.archivePath = archivePath;
		this.containerXmlFile = 'META-INF/container.xml';
		this.pages = 100; // TODO
	}
	
	
	async load() {
		await this.getArchiveFiles();
		await this.getContainerXml();
		await this.getContentOpf();
		this.getContentFolder();
		this.getContentFiles();
		await this.getTocNcx();
	}
	
	async getArchiveFiles() {
		// get a directory listing of all files in the archive
		this.archiveFiles = await getArchiveInfo(this.archivePath);	
	}	
	
	async getContainerXml() {
		// we already know the container.xml path, so just get the contents and parse into xml
		let containerXmlStr = await getFileInArchiveAsText(this.containerXmlFile, this.archivePath);
		this.containerXml = await parseXml(containerXmlStr);
	}
		
	async getContentOpf() {
		// get the rootfile from the container.xml
		const rootfileEl = this.containerXml.querySelector('rootfile');
		this.contentOpfFile = rootfileEl.getAttribute('full-path');
		// get the contents of the file and parse into xml
		const contentOpfStr = await getFileInArchiveAsText(this.contentOpfFile, this.archivePath);
		this.contentOpf = await parseXml(contentOpfStr);
	}

	getContentFolder() {
		// use the content.opf path to get the main content folder
		let contentFolderParts = this.contentOpfFile.split('/')
		contentFolderParts.pop();
		this.contentFolder = contentFolderParts.join('/');		
	}
	
	getContentFiles() {
		let itemRefs: NodeListOf<Element> = this.contentOpf
			.querySelectorAll('package spine itemref');
		let itemIds: string[] = [...itemRefs].map((e) => { return e.getAttribute('idref'); });
		console.log(itemIds);
			
		let items: Element[] = [
			...this.contentOpf.querySelectorAll('package manifest item')
		].filter((e) => { return itemIds.indexOf(e.getAttribute('id')) != -1; });
		console.log(items);
			
		this.contentFiles = items.map((el: Element): string => {
			let chunkFile: string = el.getAttribute('href');
			chunkFile = this.contentFolder + '/' + chunkFile;
			return chunkFile;
		});
		
		console.log(this.contentFiles);
	}

	async getTocNcx() {
		const tocItem = this.contentOpf.querySelector('manifest item[id=ncx]');
		this.tocNcxFile = this.contentFolder + '/' + tocItem.getAttribute('href');
		// get the file contents and parse into xml
		let tocNcxStr = await getFileInArchiveAsText(this.tocNcxFile, this.archivePath);
		this.tocNcx = await parseXml(tocNcxStr);
	}
	
	async renderHtml(): Promise<SanitizedHtmlWrapper> {
		
		let dirtyChunks: string[] = [];
		
		for (let i = 0; i < this.contentFiles.length; i++) {
			let chunkFile: string = this.contentFiles[i];
			let chunkDirty = await getFileInArchiveAsText(chunkFile, this.archivePath);
						
			let doc: Document = await parseHtml(chunkDirty);
			let head = doc.getElementsByTagName('head')[0];
			let body = doc.getElementsByTagName('body')[0];
			
			// inline image data
			let images = body.querySelectorAll('img');
			for (let i = 0; i < images.length; i++) {
				const el = images[i];
				let imageFile = this.contentFolder + '/' + el.getAttribute('src');
				let imageData64 = await getFileInArchiveAsBase64(imageFile, this.archivePath);
				el.setAttribute('src', 'data:image/jpeg;base64,'+imageData64);
			}
			
			dirtyChunks.push(body.innerHTML);
		}
		
		let bodyClean: SanitizedHtmlWrapper = await SanitizedHtmlWrapper.create(dirtyChunks.join(''));
		
		return bodyClean;
	}
	
	getCoverFile(): string {
		let coverEl = this.contentOpf.querySelector('meta[name=cover]');
		let coverId = coverEl.getAttribute('content');
		let coverItem = this.contentOpf.querySelector('manifest item[id=' + coverId + ']');
		let coverFile: string = this.contentFolder + '/' + coverItem.getAttribute('href');
		return coverFile;
	}
	
}
