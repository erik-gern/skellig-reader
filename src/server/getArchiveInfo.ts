import openArchive from './openArchive';

export default function getArchiveInfo (archivePath) {
	return new Promise((resolve, reject) => {
		try {
			const zip = openArchive(archivePath);
			const zipEntries = zip.getEntries();
			const entries = zipEntries.map((e) => { return e.entryName; });
			resolve(entries);
		} catch(e) {
			reject(e);
		}
	});
}
