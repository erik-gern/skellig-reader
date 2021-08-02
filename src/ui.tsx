import * as ReactDOM from 'react-dom';
import * as React from 'react';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import App from './components/App';
import { registerProcessDetails } from './util';
import { IpcConfig } from './ipc';

main();

async function main() {
	// set ipc spec
	// use synchronous file read so Browserify can inline it
	const ipcSpec = yaml.load(fs.readFileSync(__dirname + '/ipc/ipc-spec.yaml', 'utf-8'));
	IpcConfig.getInstance().set(ipcSpec);
	
	// get environment details from main process
	await registerProcessDetails();
	
	// set up app component
	ReactDOM.render(
		<App />,
		document.getElementById('root')
	);
}
