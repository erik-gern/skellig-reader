const { expect } = require('chai');

const { runTask } = require('../../src/ipc');
const { PreloadRegistry } = require('../../src/util');
const MockIpcRenderer = require('./_MockIpcRenderer');

describe('ipc/runTask()', function(){
	beforeEach(function(){
		const ipcRenderer = new MockIpcRenderer();
		ipcRenderer._handleInvoke('foo.bar', function(baz){
			return baz;
		});
		PreloadRegistry.getInstance().register('ipcRenderer', ipcRenderer);
	});
	afterEach(function(){
		PreloadRegistry.removeInstance();
	});
	
	it('runs a task on the the main process with id="main"', function(done){
		const ret = 'baz';
		let p = runTask('main', 'foo.bar', [ret]);
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
