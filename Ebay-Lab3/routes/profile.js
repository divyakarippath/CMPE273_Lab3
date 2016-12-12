/**
 * New node file
 */
var soap = require('soap');
var baseURL = "http://localhost:8080/EbayApp/services";
var parseString = require('xml2js').parseString;
exports.loadProfile = function(req, res) {
	if (req.session.email && req.session.name) {

		res.render("viewprofile", {
			name : req.session.name,
			lastlogin : req.session.lastlogin
		});

	} else {
		res.redirect('/');
		// res.render('login', { title: 'Login' });
	}
};

exports.getOrders = function(req, res) {
	// Checks before redirecting whether the session is valid
	if (req.session.email && req.session.name) {

		var option = {
			ignoredNamespaces : true
		};
		var url = baseURL + "/Profile?wsdl";
		console.log("&&&:"+req.session.id);
		var args = {
			userId : req.session.id
		};
		soap.createClient(url, option, function(err, client) {
			client.getOrders(args, function(err, result) {
				var xml = result.getOrdersReturn;
				parseString(xml, function(err, output) {
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

exports.getSoldItems = function(req, res) {
	if (req.session.email && req.session.name) {
		
		
		var option = {
				ignoredNamespaces : true
			};
			var url = baseURL + "/Profile?wsdl";
			var args = {
				userId : req.session.id
			};
			soap.createClient(url, option, function(err, client) {
				client.getSoldItems(args, function(err, result) {
					var xml = result.getSoldItemsReturn;
					parseString(xml, function(err, output) {
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
