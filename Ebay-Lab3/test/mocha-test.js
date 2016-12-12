var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('Check Login', function(done) {
		request.post(
			    'http://localhost:3000/checklogin',
			    { form: { email: 'priya.ebay@gmail.com',password:'priya' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	
	it('Return True if  getFixedpriceAds is working', function(done){
		http.get('http://localhost:3000/getFixedpriceAds', function(res) {
			assert.equal(302, res.statusCode);
			done();
		})
	});
	
	it('Return True if  getAuctionAds is working', function(done){
		http.get('http://localhost:3000/getAuctionAds', function(res) {
			assert.equal(302, res.statusCode);
			done();
		})
	});
	
	
	
	it('Return True if  logout is successful', function(done) {
		request.post(
			    'http://localhost:3000/logout',
			    { form: {  } },
			    function (error, response, body) {
			    	assert.equal(302, response.statusCode);
			    	done();
			    }
			);
	  });
	
	
	it('Return True if  getSoldItems is successful', function(done){
		http.get('http://localhost:3000/getSoldItems', function(res) {
			assert.equal(302, res.statusCode);
			done();
		})
	});
	
	
});