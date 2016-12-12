/**
 * New node file
 */

var soap = require('soap');
var baseURL = "http://localhost:8080/EbayApp/services";
var parseString = require('xml2js').parseString;
var SimpleNodeLogger = require('simple-node-logger'), opts = {
	logFilePath : 'mylogfile.log',
	timestampFormat : 'YYYY-MM-DD HH:mm:ss.SSS'
}, log = SimpleNodeLogger.createSimpleLogger(opts);
var log = SimpleNodeLogger.createSimpleFileLogger('project.log');
exports.loadPage = function(req, res) {
	if (req.session.email && req.session.name) {
		log.info("The user " + req.session.id
				+ "accessing the advertisements page");
		res.render("advertisements", {
			name : req.session.name,
			lastlogin : req.session.lastlogin
		});
	} else {
		res.redirect('/');
		// res.render('login', { title: 'Login' });
	}

};
exports.getAuctionAdvertisements = function(req, res) {
	// Checks before redirecting whether the session is valid
	if (req.session.email && req.session.name) {

		var option = {
			ignoredNamespaces : true
		};
		var url = baseURL + "/Advertisements?wsdl";
		var args = {};
		soap.createClient(url, option, function(err, client) {
			client.getAuctionAdvertisements(args, function(err, result) {
				var xml = result.getAuctionAdvertisementsReturn;
				parseString(
						xml,
						function(err, output) {
							if (output.results.result != undefined) {
								console.log(output.results.result);
								res.send(output.results.result);
								
							}
						});
				

			});
		});

	} else {
		res.redirect('/');
		// res.render('login', { title: 'Login' });
	}
};
exports.getFixedpriceAdvertisements = function(req, res) {
	// Checks before redirecting whether the session is valid
	if (req.session.email && req.session.name) {

		var option = {
			ignoredNamespaces : true
		};
		var url = baseURL + "/Advertisements?wsdl";
		var args = {};
		soap.createClient(url, option, function(err, client) {
			client.getFixedpriceAdvertisements(args, function(err, result) {
				var xml = result.getFixedpriceAdvertisementsReturn;
				parseString(
						xml,
						function(err, output) {
							if (output.results.result != undefined) {
								console.log("true");
								console.log(output.results.result);
								res.send(output.results.result);
								
							}
						});

			});
		});

	} else {
		res.redirect('/');
		// res.render('login', { title: 'Login' });
	}
};
exports.getCartItems = function(req, res) {

	// Checks before redirecting whether the session is valid
	if (req.session.email && req.session.name) {
		res.send(req.session.cartItems);
	} else {
		res.redirect('/');
		// res.render('login', { title: 'Login' });
	}
};

exports.addBid = function(req, res) {
	if (req.session.email && req.session.name) {
		// These two variables come from the form on
		// the views/login.hbs page
		var selectedItem = req.param("items");
		var quantity = req.param("quantity");
		var bidprice = req.param("bidprice");
		for ( var key in quantity) {
			var quant = quantity[key];
			console.log("Value: " + quantity[key]);
		}
		for ( var key in bidprice) {
			var bprice = bidprice[key];
			console.log("Value: " + bidprice[key]);
		}
		// var selJson = JSON.parse(selectedItem);
		console.log("selected :"+selectedItem);
		var json_responses;
		if (quant <= selectedItem.itemquantity) {
			console.log("less quantity");
			console.log("success");
			
			
			
				var option = {
					ignoredNamespaces : true
				};
				var url = baseURL + "/Advertisements?wsdl";
				var args = {
						userId : req.session.id,
						ad_id : selectedItem.id,
						quantity : quant,
						price : bprice
						
				};
				soap.createClient(url, option, function(err, client) {
					client.addBid(args, function(err, result) {
						log.info("The user " + req.session.id
								+ "placed a bid on advertisement "
								+ selectedItem.id);
						json_responses = {
							"statusCode" : 200
						};
						res.send(json_responses);

					});
				});
			

		} else {
			json_responses = {
				"statusCode" : 401
			};
			res.send(json_responses);
		}

	} else {
		res.redirect('/');
		// res.render('login', { title: 'Login' });
	}

};
