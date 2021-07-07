import { SanitizedHtmlWrapper } from '../xml';

export default abstract class Book {
	abstract load(): Promise<void>;
	abstract renderHtml(): Promise<SanitizedHtmlWrapper>;
	abstract getCoverFile(): string;
}
