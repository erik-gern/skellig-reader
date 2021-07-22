// App.tsc

const { expect } = require('chai');
const App = require('../../dist/components/App').default;
const { PreloadRegistry } = require('../../dist/util');

describe('App', function() {
	beforeEach(function(){
		let preloadRegistry = PreloadRegistry.getInstance();
		preloadRegistry.register('platform', 'linux');
	})
	afterEach(function(){
		PreloadRegistry.removeInstance();
	});
	
	describe('::constructor', function() {
		it('successfully constructs the component', function() {
			let props = {};
			let app = new App(props);
			expect(app).to.be.an.instanceof(App)
				.to.have.any.keys('render', 'props', 'state');
		});
	});
	
});
