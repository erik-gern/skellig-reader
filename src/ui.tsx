import * as ReactDOM from 'react-dom';
import * as React from 'react';
import App from './components/App';
import { registerProcessDetails } from './util';

main();

async function main() {
	// get environment details from main process
	await registerProcessDetails();
	
	// set up app component
	ReactDOM.render(
		<App />,
		document.getElementById('root')
	);
}
