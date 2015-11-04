var should = require('should');
var proxy = require('../index');

describe('Proxy', function(){
	var controllerSettings = {};
	var testProxy;
	
	before(function(){
		controllerSettings.hostname = 'testhost';
		testProxy = proxy(controllerSettings);
	});
	
	describe('Initialization', function(){
		it('throws error when hostname not provided', function(){
			(proxy).should.throw();
		});
	});
	
	describe('Calling API with required inputs', function(){
		it('masking relay requires options', function(){			
			(testProxy.maskRelay).should.throw(Error);
		});
		it('overriding channels requires options', function(){			
			(testProxy.override).should.throw(Error);
		});		
	});
});