const { expect } = require('chai');
const IpcProcess = require('../../dist/ipc/IpcProcess').default;

function TestObj() {
	return this;
}

describe('ipc/IpcProcess', function(){
	const config = {
		'foo-bar.task': {
			'type': 'task',
			'args': ['string', 'number'],
			'ret': 'number',
		},
		'foo-bar.event': {
			'type': 'event',
			'args': ['string', 'number'],
			'ret': 'number',
		},
	};
	let ipcProcess;
	
	beforeEach(function(){
		ipcProcess = new IpcProcess();
		ipcProcess.setConfig(config);
		// extend with concrete methods to log function calls
		ipcProcess._sent = [];
		ipcProcess._listening = [];
		ipcProcess._ran = [];
		ipcProcess._handled = [];
		ipcProcess._doSend = function(...args){
			this._sent.push(args);
		}
		ipcProcess._doListen = function(...args){
			this._listening.push(args);
		}
		ipcProcess._doRun = function(...args){
			this._ran.push(args);
			return new Promise(function(resolve, reject){ resolve(3) });
		}
		ipcProcess._doHandle = function(...args){
			this._handled.push(args);
		}
	});
	
	describe('::constructor()', function(){
		it('builds the IpcProcess instance', function(){
			expect(ipcProcess).to.be.an.instanceof(IpcProcess);
		});
	});
	
	describe('::getType()', function(){
		const tests = [
			['foo', 'string'],
			[1, 'number'],
			[1.2, 'number'],
			[[], 'array'],
			[{}, 'object'],
			[true, 'boolean'],
			[false, 'boolean'],
			[null, 'null'],
			[new TestObj(), 'TestObj'],
		];
		tests.forEach(function(test, i){
			const [val, t] = test;
			it(`checks for a ${t} type (test #${i})`, function(){
				expect(ipcProcess.getType(val)).to.equal(t);
			});
		})
	});
	
	describe('::checkChannelName()', function(){
		it('does not throw if passed a valid name', function(){
			expect(function(){ ipcProcess.checkChannelName('foo-bar.task'); }).not.to.throw();
		});
		it('throws on an invalid channel name', function(){
			expect(function(){ ipcProcess.checkChannelName('bad'); }).to.throw();
		});
	});
	
	describe('::checkChannelType()', function(){
		const tests = {
			'correct type': [false, 'foo-bar.event', 'event'],
			'incorrect type': [true, 'foo-bar.event', 'task'],
		};
		Object.keys(tests).forEach(function(desc){
			const [willThrow, channel, type] = tests[desc];
			it((willThrow ? 'will throw' : 'will not throw') + ` with ${desc}`, function(){
				if (willThrow) {
					expect(function(){ ipcProcess.checkChannelType(channel, type); }).to.throw();
				}
				else {
					expect(function(){ ipcProcess.checkChannelType(channel, type); }).not.to.throw();
				}
			})
		});
	})
	
	describe('::checkChannelArgs()', function(){
		const tests = {
			'correct arguments and types': [false, 'foo-bar.event', [ 'foo', 1 ]],
			'too few arguments': [true, 'foo-bar.event', [ 'foo' ]],
			'wrong argument types': [true, 'foo-bar.event', [ 'foo', 'bar' ]],
			'too many arguments': [true, 'foo-bar.event', [ 'foo', 'bar', 'baz' ]],
		};
		Object.keys(tests).forEach(function(desc) {
			const [willThrow, channel, args] = tests[desc];
			it((willThrow ? 'will throw' : 'will not throw') + ` with ${desc}`, function(){
				if (willThrow) {
					expect(function(){ ipcProcess.checkChannelArgs(channel, args); }).to.throw();
				}
				else {
					expect(function(){ ipcProcess.checkChannelArgs(channel, args); }).not.to.throw();
				}
			})
		});
	});
	
	describe('::checkChannelRet()', function(){
		const tests = {
			'correct return type': [false, 'foo-bar.task', 3],
			'incorrect return type': [true, 'foo-bar.task', 'nope'],
		};
		Object.keys(tests).forEach(function(desc){
			const [willThrow, channel, ret] = tests[desc];
			it((willThrow ? 'will throw' : 'will not throw') + ` with ${desc}`, function(){
				if (willThrow) {
					expect(function(){ ipcProcess.checkChannelRet(channel, ret); }).to.throw();
				}
				else {
					expect(function(){ ipcProcess.checkChannelRet(channel, ret); }).not.to.throw();
				}
			});
		});
	});
	
	describe('::send()', function(){
		it('calls the _doSend() function', function(){
			let channel = 'foo-bar.event';
			let args = ['foo', 3];
			ipcProcess.send(channel, ...args);
			expect(ipcProcess._sent.length).to.equal(1);
			expect(ipcProcess._sent[0]).to.eql([channel, ...args]);
		});
		const tests = {
			'fails on bad channel': ['foo-bad', 'foo', 3],
			'fails on bad type': ['foo-bar.task', 'foo', 3],
			'fails on bad arguments': ['foo-bar.event', 'foo', 'bar'],
		};
		Object.keys(tests).forEach(function(desc){
			const [channel, ...args] = tests[desc];
			it(desc, function(){
				expect(function(){ ipcProcess.send(channel, ...args); }).to.throw();
			});
		});
	});
	
	describe('::listen()', function(){
		it('calls the _doListen() function', function(){
			let channel = 'foo-bar.event';
			let callback = (...args) => {};
			ipcProcess.listen(channel, callback);
			expect(ipcProcess._listening.length).to.equal(1);
			expect(ipcProcess._listening[0]).to.eql([channel, callback]);
		});
		const tests = {
			'fails on bad channel': ['foo-bad.task', () => {}],
			'fails on bad type': ['foo-bar.task', () => {}],
		};
		Object.keys(tests).forEach(function(desc){
			const [channel, callback] = tests[desc];
			it(desc, function(){
				expect(function(){ ipcProcess.listen(channel, callback); }).to.throw();
			});
		});
	});
	
	describe('::run()', function(){
		it('calls the _doRun() function', function(done){
			let channel = 'foo-bar.task';
			let args = ['foo', 3];
			let p = ipcProcess.run(channel, ...args);
			expect(p).to.be.an.instanceof(Promise);
			expect(ipcProcess._ran.length).to.equal(1);
			expect(ipcProcess._ran[0]).to.eql([channel, ...args]);
			p.then(function(r){
				expect(r).to.be.a('number');
				done();
			});
		});
		
		it('fails on a bad return value', function(done){
			let channel = 'foo-bar.task';
			let args = ['foo', 3];
			ipcProcess._doRun = function(channel, ...args){
				return new Promise(function(resolve, reject){ resolve('bad ret'); });
			};
			let p = ipcProcess.run(channel, args);
			expect(p).to.be.an.instanceof(Promise);
			p.then(function(ret){
				done('Promise returned a value');
			}, function(e){
				expect(e).to.be.an.instanceof(Error);
				done();
			});
		});
		
		const tests = {
			'fails on bad channel': ['foo-bad', 'foo', 3],
			'fails on bad type': ['foo-bar.event', 'foo', 3],
			'fails on bad arguments': ['foo-bar.task', 'foo', 'bar'],
		};
		Object.keys(tests).forEach(function(desc){
			const [channel, ...args] = tests[desc];
			it(desc, function(){
				let p = ipcProcess.run(channel, ...args);
				p.then(function(ret){
					done('Promise returned a value')
				}, function(e){
					expect(e).to.be.an.instanceof(Error);
					done();
				})
			});
		});
		
	});
	
	describe('::handle()', function(){
		it('calls the _doHandle() function', function(){
			let channel = 'foo-bar.task';
			let callback = (...args) => { return 3; };
			ipcProcess.handle(channel, callback);
			expect(ipcProcess._handled.length).to.equal(1);
			expect(ipcProcess._handled[0]).to.eql([channel, callback]);
		});
		const tests = {
			'fails on bad channel': ['foo-bad.task', () => {}],
			'fails on bad type': ['foo-bar.event', () => {}],
		};
		Object.keys(tests).forEach(function(desc){
			const [channel, callback] = tests[desc];
			it(desc, function(){
				expect(function(){ ipcProcess.handle(channel, callback); }).to.throw();
			});
		});
		
	});
	
});