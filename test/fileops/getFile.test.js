const { expect } = require('chai');
const yaml = require('js-yaml');
const fs = require('fs');

const getFile = require('../../dist/fileops/getFile').default;
const IpcConfig = require('../../dist/ipc/IpcConfig').default;
const PreloadRegistry = require('../../dist/util/PreloadRegistry').default;
const MockIpcRenderer = require('../ipc/_MockIpcRenderer');

describe('fileops/getFile()', function(){
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
	
	it('returns a Promise<ArrayBuffer> when called', function(done){
		const expectedPath = 'foo/bar';
		ipcRenderer._handleInvoke('io.file-read', function(path){
			expect(path).to.equal(expectedPath);
			return new ArrayBuffer();
		});
		let p;
		try {
			p = getFile(expectedPath);
			expect(p).to.be.an.instanceof(Promise);
		}
		catch (e) {
			done(e);
		}
		p.then(function(data){
			expect(data).to.be.an.instanceof(ArrayBuffer);
			done();
		}, function(e){
			done(e);
		});
	});
});
