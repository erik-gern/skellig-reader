import PreloadRegistry from './PreloadRegistry';

export default function getAppName(): string {
	return PreloadRegistry.getInstance().get<string>('appName');	
}
