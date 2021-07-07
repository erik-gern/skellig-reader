import PreloadRegistry from './PreloadRegistry';

export default function getPlatform(): string {
	return PreloadRegistry.getInstance().get<string>('platform');	
}
