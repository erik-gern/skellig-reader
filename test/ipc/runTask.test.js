const { expect } = require('chai');

const { runTask, IpcConfig } = require('../../dist/ipc');
const { PreloadRegistry } = require('../../dist/util');
const MockIpcRenderer = require('./_MockIpcRenderer');
const config = require('./_testConfig');

describe('ipc/runTask()', function(){
	beforeEach(function(){
		
		const ipcConfig = IpcConfig.getInstance();
		ipcConfig.set(config);
		
		const ipcRenderer = new MockIpcRenderer();
		ipcRenderer._handleInvoke('foo-bar.task', function(s, n){
			return n;
		});
		PreloadRegistry.getInstance().register('ipcRenderer', ipcRenderer);
	});
	afterEach(function(){
		PreloadRegistry.removeInstance();
		IpcConfig.instance = null;
	});
	
	it('runs a task on the the main process with id="main"', function(done){
		const ret = 42;
		let p = runTask('main', 'foo-bar.task', ['foobar', ret]);
		expect(p).to.be.an.instanceof(Promise);
		p.then(function(r){
			try {
				expect(r).to.equal(ret);
				done();
			}
			catch (e) {
				done(e);
			}
		}, function(e){
			done(e);
		});
	});
	
	it('throws when an id that is not "main" is passed', function(){
		expect(function(){ runTask('foo', 'bar', []); }).to.throw();
	});
});
