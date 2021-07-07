const { expect } = require('chai');

const { SanitizedHtmlWrapper } = require('../../src/xml');

const testDirtyHtml = '<html><head><script src="bad.js"></script></head><body><p>Hello</p></body></html>';
const testCleanHtml = '<p>Hello</p>';

describe('xml/SanitizedHtmlWrapper', function(){
	describe('#create()', function(){
		it('sanitizes html and returns a new wrapper', function(done){
			let p = SanitizedHtmlWrapper.create(testDirtyHtml);
			expect(p).to.be.an.instanceof(Promise);
			p.then(function(wrapper){
				try {
					expect(wrapper).to.be.an.instanceof(SanitizedHtmlWrapper);
					expect(wrapper.html).to.equal(testCleanHtml);
					done();
				}
				catch (e) {
					done(e);
				}
			}, function(e){
				done(e);
			})
		});
	});
	
	describe('::constructor()', function(){
		it('creates a new instance with the passed-in html argument', function(){
			let wrapper = new SanitizedHtmlWrapper(testCleanHtml);
			expect(wrapper.html).to.equal(testCleanHtml);
		});
	});
	
	describe('::toString()', function(){
		it('returns a string representation of the cleaned html', function(){
			let wrapper = new SanitizedHtmlWrapper(testCleanHtml);
			expect(wrapper.toString()).to.equal(wrapper.html);
		});
	});
	
	describe('::append()', function(){
		it('returns a new wrapper with the parent html appended with the passed-in html', function(){
			const html1 = '<p>Hello</p>';
			const html2 = '<p>World</p>';
			const wrapper = new SanitizedHtmlWrapper(html1);
			const appendedWrapper = wrapper.append(html2);
			expect(appendedWrapper).not.to.equal(wrapper);
			expect(appendedWrapper.html).to.equal(html1 + html2);
		});
	});
});
