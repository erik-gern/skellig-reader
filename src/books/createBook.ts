import EPubBook from './EPubBook';
import MarkdownBook from './MarkdownBook';
import Book from './Book';

export default async function createBook(file: string): Promise<Book> {
	let fileParts = file.split('.');
	let ext = fileParts[fileParts.length - 1];
	let book: Book;
	switch (ext) {
		case 'epub':
			book = new EPubBook(file);
			break;
		case 'md':
		case 'txt':
			book = new MarkdownBook(file);
			break;
		default:
			throw new Error('The extension ' + ext + ' is not supported.');
	}
	await book.load();
	return book;
}
