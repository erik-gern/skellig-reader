const { expect } = require('chai');
const { parseHtml } = require('../../src/xml');

const tests = [
	'<html><head></head><body><h1>Hello, world!</h1></body></html>',
	'<p>Hello there!</p>',
];

describe('xml/parseHtml()', function(){
	tests.forEach(function(html, i){
		it(`returns a DOM object from the parsed html string (test #${i})`, function(done){
			const p = parseHtml(html);
			expect(p).to.be.an.instanceof(Promise);
			p.then(function(doc){
				try {
					expect(doc.querySelector).to.be.an.instanceof(Function);
					expect(doc.documentElement.tagName).to.equal('HTML');
					done();
				}
				catch (e) {
					done(e);
				}
			}, function(e){
				done(e);
			});
		});
	});
});
