const { expect } = require('chai');
const IpcConfig = require('../../dist/ipc/IpcConfig').default;
const config = require('./_testConfig');

function TestObj() {
	return this;
}

describe('ipc/IpcConfig', function(){
	let ipcConfig;
	
	beforeEach(function(){
		ipcConfig = new IpcConfig(config);
	});
	
	describe('::constructor()', function(){
		it('builds the IpcConfig instance', function(){
			expect(ipcConfig).to.be.an.instanceof(IpcConfig);
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
				expect(ipcConfig.getType(val)).to.equal(t);
			});
		})
	});
	
	describe('::checkChannelName()', function(){
		it('does not throw if passed a valid name', function(){
			expect(function(){ ipcConfig.checkChannelName('foo-bar.task'); }).not.to.throw();
		});
		it('throws on an invalid channel name', function(){
			expect(function(){ ipcConfig.checkChannelName('bad'); }).to.throw();
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
					expect(function(){ ipcConfig.checkChannelType(channel, type); }).to.throw();
				}
				else {
					expect(function(){ ipcConfig.checkChannelType(channel, type); }).not.to.throw();
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
					expect(function(){ ipcConfig.checkChannelArgs(channel, args); }).to.throw();
				}
				else {
					expect(function(){ ipcConfig.checkChannelArgs(channel, args); }).not.to.throw();
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
					expect(function(){ ipcConfig.checkChannelRet(channel, ret); }).to.throw();
				}
				else {
					expect(function(){ ipcConfig.checkChannelRet(channel, ret); }).not.to.throw();
				}
			});
		});
	});
	
	
});