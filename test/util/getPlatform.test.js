const { getPlatform, PreloadRegistry } = require('../../src/util');
const { expect } = require('chai');

describe('util/getPlatform()', function(){
	beforeEach(function(){
		PreloadRegistry.getInstance();
	});
	afterEach(function(){
		PreloadRegistry.removeInstance();
	});

	['darwin', 'windows', 'linux'].forEach(function(plat){
		it(`should return a string (${plat})`, function(){
			PreloadRegistry.getInstance().register('platform', plat);
			expect(getPlatform()).to.be.a('string')
				.to.equal(plat);
		});		
	});
});
