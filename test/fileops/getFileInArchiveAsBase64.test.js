const { expect } = require('chai');
const yaml = require('js-yaml');
const fs = require('fs');

const getFileInArchiveAsBase64 = require('../../dist/fileops/getFileInArchiveAsBase64').default;
const IpcConfig = require('../../dist/ipc/IpcConfig').default;
const PreloadRegistry = require('../../dist/util/PreloadRegistry').default;
const MockIpcRenderer = require('../ipc/_MockIpcRenderer');

describe('fileops/getFileInArchiveAsBase64()', function(){
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
		const toRetStr = 'foo bar';
		const toRetB64 = Buffer.from(toRetStr).toString('base64');
		ipcRenderer._handleInvoke('io.archive-file-read', function(path, archive){
			const encoder = new TextEncoder();
			const view = encoder.encode(toRetStr);
			return view.buffer;
		});
		let p;
		try {
			p = getFileInArchiveAsBase64('foo/bar', 'foo.zip');
			expect(p).to.be.an.instanceof(Promise);
		}
		catch (e) {
			done(e);
		}
		p.then(function(data){
			try {
				expect(data).to.be.a('string');
				expect(data).to.equal(toRetB64);
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
