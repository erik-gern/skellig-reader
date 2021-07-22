const { getAppName, PreloadRegistry } = require('../../dist/util');
const { expect } = require('chai');

describe('util/getAppName()', function(){
	beforeEach(function(){
		PreloadRegistry.getInstance();
	});
	afterEach(function(){
		PreloadRegistry.removeInstance();
	});

	const thisAppName = 'this-app';
	it(`should return a string`, function(){
		PreloadRegistry.getInstance().register('appName', thisAppName);
		expect(getAppName()).to.be.a('string')
			.to.equal(thisAppName);
	});		
});
