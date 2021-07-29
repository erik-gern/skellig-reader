import openArchive from './openArchive';

export default function getFileDataInArchive (file, archive): Promise<ArrayBuffer> {
	return new Promise((resolve, reject) => {
		try {
			const zip = openArchive(archive);
			resolve(zip.readFile(file));
		} catch(e) {
			reject(e);
		}
	});
}
