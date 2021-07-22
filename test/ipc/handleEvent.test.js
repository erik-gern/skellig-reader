const { expect } = require('chai');

const { handleEvent } = require('../../dist/ipc');
const { PreloadRegistry } = require('../../dist/util');
const MockIpcRenderer = require('./_MockIpcRenderer');

describe('ipc/handleEvent()', function(){
	beforeEach(function(){
		const ipcRenderer = new MockIpcRenderer();
		PreloadRegistry.getInstance().register('ipcRenderer', ipcRenderer);
	});
	afterEach(function(){
		PreloadRegistry.removeInstance();
	});
	
	it('listens for an event with id="main"', function(done){
		let ipcRenderer = PreloadRegistry.getInstance().get('ipcRenderer');
		let ret = 'baz';
		handleEvent('main', 'foo.bar', function(r){
			try {
				expect(r).to.equal(ret);
				done();
			}
			catch (e) {
				done(e);
			}
		});
		setTimeout(function(){
			try {
				ipcRenderer._triggerEvent('foo.bar', 'baz');
			}
			catch (e) {
				done(e);
			}
		}, 10);
	});
	
	it('throws when an id that is not "main" is passed', function(){
		expect(function(){ handleEvent('foo', function(){}); }).to.throw();
	});
});
