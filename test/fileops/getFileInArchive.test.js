const { expect } = require('chai');
const yaml = require('js-yaml');
const fs = require('fs');

const getFileInArchive = require('../../dist/fileops/getFileInArchive').default;
const IpcConfig = require('../../dist/ipc/IpcConfig').default;
const PreloadRegistry = require('../../dist/util/PreloadRegistry').default;
const MockIpcRenderer = require('../ipc/_MockIpcRenderer');

describe('fileops/getFileInArchive()', function(){
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
		const expectedArchive = 'foo.zip';
		ipcRenderer._handleInvoke('io.archive-file-read', function(path, archive){
			expect(path).to.equal(expectedPath);
			expect(archive).to.equal(expectedArchive);
			return new ArrayBuffer();
		});
		let p;
		try {
			p = getFileInArchive(expectedPath, expectedArchive);
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
