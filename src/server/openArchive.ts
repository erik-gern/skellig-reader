import * as AdmZip from 'adm-zip';

const archiveCache = {};

export default function openArchive (archive): AdmZip {
	if (!archiveCache[archive]) {
		archiveCache[archive] = new AdmZip(archive);
	}
	return archiveCache[archive];
}
