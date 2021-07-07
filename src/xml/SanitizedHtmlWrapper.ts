import * as createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

export default class SanitizedHtmlWrapper {

	static create(dirtyStr): Promise<SanitizedHtmlWrapper> {
		return new Promise((resolve, reject) => {
			const window = new JSDOM('').window;
			const DOMPurify = createDOMPurify(window);
			const cleanStr = DOMPurify.sanitize(dirtyStr, {USE_PROFILES: {html: true}});
			const wrapper: SanitizedHtmlWrapper = new SanitizedHtmlWrapper(cleanStr);
			resolve(wrapper);
		});
	}
	
	private html: string;

	protected constructor(html: string) {
		this.html = html;
	}

	toString(): string {
		return this.html;
	}
	
	append(...wrappers: SanitizedHtmlWrapper[]): SanitizedHtmlWrapper {
		const appended: string = [
			this.html, 
			...wrappers.map((w) => w.toString())
		].join('');
		return new SanitizedHtmlWrapper(appended);
	}
}