import PreloadRegistry from './PreloadRegistry';
import * as ipc from '../ipc';

export default async function registerProcessDetails(): Promise<void> {
	const registry = PreloadRegistry.getInstance();
	const details = await ipc.runTask('main', 'process.details', []);
	registry.register('platform', details.process.platform);
	registry.register('appName', details.app.name);
	registry.lock();
}
