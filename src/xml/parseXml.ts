import { JSDOM } from 'jsdom';

export default function parseXml (xmlStr): Promise<Element> {
	return new Promise((resolve, reject) => {
		const dom = new JSDOM(xmlStr, { contentType: 'text/xml' });
		resolve(dom.window.document);		
	});
}
