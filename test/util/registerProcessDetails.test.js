const { expect } = require('chai');

const { registerProcessDetails, PreloadRegistry } = require('../../dist/util');
const ipc = require('../../dist/ipc');

describe('util/registerProcessDetails()', function(){
	const thisPlatform = 'this-platform';
	const thisAppName = 'this-appname';
	
	beforeEach(function(){
		ipc.runTask = function(id, name, args){
			return new Promise(function(resolve, reject){
				if (!args) args = [];
				if (id == 'main' && name == 'process.details') {
					resolve({
						process: {
							platform: thisPlatform,
						},
						app: {
							name: thisAppName,
						},
					});
				}
				reject();
			});
		};
	});
	
	afterEach(function(){
		PreloadRegistry.removeInstance();
	});
	
	const tests = [
		{ args: ['platform'], ret: thisPlatform },
		{ args: ['appName'], ret: thisAppName },
	];
	
	tests.forEach(function({args, ret}){
		const [key] = args;
		it(`registers ${key} correctly (returns ${ret})`, function(done){
			let p = registerProcessDetails()
			expect(p).to.be.an.instanceof(Promise);
			p.then(function(){
				expect(PreloadRegistry.getInstance().get(key)).to.equal(ret);
				done();
			}, function(e){
				done(e);
			});
		});
	});
});