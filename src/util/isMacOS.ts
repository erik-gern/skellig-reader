import getPlatform from './getPlatform';

export default function isMacOS(): boolean {
	return getPlatform() === 'darwin';
}
