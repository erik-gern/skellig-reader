const { expect } = require('chai');
const { parseXml } = require('../../src/xml');

const tests = [
	{xml: '<foo><bar /></foo>', tagName: 'foo'},
	{xml: '<foo:foo xmlns:foo="http://foo.com"><foo:bar /></foo:foo>', tagName: 'foo:foo'},
];

describe('xml/parseXml()', function(){
	tests.forEach(function(test, i){
		const { xml, tagName } = test;
		it(`returns a DOM object from the parsed xml string (test #${i})`, function(done){
			const p = parseXml(xml);
			expect(p).to.be.an.instanceof(Promise);
			p.then(function(doc){
				try {
					expect(doc.querySelector).to.be.an.instanceof(Function);
					expect(doc.documentElement.tagName).to.equal(tagName);
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
