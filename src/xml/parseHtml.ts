import { JSDOM } from 'jsdom';

export default function parseHtml (htmlStr): Promise<Document> {
	return new Promise((resolve, reject) => {
		const dom = new JSDOM(htmlStr, { contentType: 'text/html' });
		resolve(dom.window.document);		
	});
}
