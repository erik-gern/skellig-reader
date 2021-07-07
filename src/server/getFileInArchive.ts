import openArchive from './openArchive';

export default function getFileInArchive (file, archive, asBase64=false) {
	return new Promise((resolve, reject) => {
		try {
			const zip = openArchive(archive);
			let content;
			if (asBase64) {
				content = zip.readFile(file).toString('base64');
			}
			else {
				content = zip.readAsText(file);
			}
			resolve(content);
		} catch(e) {
			reject(e);
		}
	});
}
