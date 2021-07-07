const { PreloadRegistry } = require('../../src/util');
const { expect } = require('chai');

describe('util/PreloadRegistry', function(){
	afterEach(function(){
		delete (global || window).__preloadRegistry;
	});
	
	describe('#getInstance()', function(){
		it('creates a new PreloadRegistry instance if none is present', function(){
			let preloadRegistry = PreloadRegistry.getInstance();
			expect(preloadRegistry).to.be.an.instanceof(PreloadRegistry);
		});
		
		it('returns an existing PreloadRegistry instance if one is present', function(){
			let preloadRegistry = (global || window).__preloadRegistry = new PreloadRegistry();
			preloadRegistry2 = PreloadRegistry.getInstance();
			expect(preloadRegistry === preloadRegistry2).to.be.true;
		});
	});
	
	describe('#removeInstance()', function(){
		it('removes an existing instance', function(){
			let preloadRegistry = PreloadRegistry.getInstance();
			PreloadRegistry.removeInstance();
			let preloadRegistry2 = PreloadRegistry.getInstance();
			expect(preloadRegistry === preloadRegistry2).to.be.false;
		});
	});
	
	describe('::lock()', function(){
		it('locks the registry when called', function(){
			let preloadRegistry = PreloadRegistry.getInstance();
			preloadRegistry.lock();
			expect(preloadRegistry._locked).to.be.true;
		});
	})
	
	describe('::register()', function(){
		it('registers a value with an associated key', function(){
			let preloadRegistry = PreloadRegistry.getInstance();
			preloadRegistry.register('foo', 'bar');
			expect(preloadRegistry._params['foo']).equals('bar');
		});
		it('throws an error if locked', function(){
			let preloadRegistry = PreloadRegistry.getInstance();
			preloadRegistry.lock();
			expect(function(){ preloadRegistry.register('foo', 'bar'); }).to.throw();
		});
	});
	
	describe('::get()', function(){
		it('returns a registered value', function(){
			let preloadRegistry = PreloadRegistry.getInstance();
			preloadRegistry.register('foo', 'bar');
			expect(preloadRegistry.get('foo')).to.equal('bar');
		});
	});
});
