import { app } from 'electron';

export default function getProcessDetails() {
	const details = {
		app: {
			name: app.name,
		},
		process: {
			platform: process.platform,
		},
	};
	return details;
}