const { expect } = require('chai');
const yaml = require('js-yaml');
const fs = require('fs');

const getFileAsText = require('../../dist/fileops/getFileAsText').default;
const IpcConfig = require('../../dist/ipc/IpcConfig').default;
const PreloadRegistry = require('../../dist/util/PreloadRegistry').default;
const MockIpcRenderer = require('../ipc/_MockIpcRenderer');

describe('fileops/getFileAsText()', function(){
	let ipcRenderer;
	beforeEach(function(){
		IpcConfig.getInstance().set(yaml.load(fs.readFileSync(__dirname + '/../../dist/ipc/ipc-spec.yaml')));
		ipcRenderer = new MockIpcRenderer();
		PreloadRegistry.getInstance().register('ipcRenderer', ipcRenderer);
	});
	afterEach(function(){
		PreloadRegistry.removeInstance();
		IpcConfig.getInstance().set({});
	});
	
	it('returns a Promise<string> when called', function(done){
		const toRet = 'foo bar';
		ipcRenderer._handleInvoke('io.file-read', function(path){
			const encoder = new TextEncoder();
			const view = encoder.encode(toRet);
			return view.buffer;
		});
		let p;
		try {
			p = getFileAsText('foo/bar');
			expect(p).to.be.an.instanceof(Promise);
		}
		catch (e) {
			done(e);
		}
		p.then(function(data){
			try {
				expect(data).to.be.a('string');
				expect(data).to.equal(toRet);
				done();
			}
			catch (e) {
				done(e);
			}
		}, function(e){
			done(e);
		});
	});
});
