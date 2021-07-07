const { isMacOS, PreloadRegistry } = require('../../src/util');
const { expect } = require('chai');

describe('util/isMacOS()', function(){
	beforeEach(function(){
		PreloadRegistry.getInstance();
	});
	afterEach(function(){
		PreloadRegistry.removeInstance();
	});
	
	const tests = [
		{ args: ['darwin'], res: true, },
		{ args: ['windows'], res: false, },
		{ args: ['linux'], res: false, },
	];
	tests.forEach(function({args, res}){
		const [platform] = args;
		it(`returns ${res ? 'true' : 'false'} if platform is '${platform}'`, function(){
			PreloadRegistry.getInstance().register('platform', platform);
			expect(isMacOS()).equals(res);
		});
	});
	
});
