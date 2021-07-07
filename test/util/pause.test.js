// pause.test.js

const { pause } = require('../../src/util');
const { expect } = require('chai');

describe('util/pause()', function(){
	[10, 100, 1000].forEach(function(t){
		it(`resolves after ${t} milliseconds`, function(done){
			const start = Date.now();
			pause(t).then(function(){
				const end = Date.now();
				const delta = end - start;
				expect(delta >= t).is.true;
				done();
			});
		});
	});
});
