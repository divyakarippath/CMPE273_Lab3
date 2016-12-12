/**
 * New node file
 */
var credit = require('./creditCard');
var soap = require('soap');
var baseURL = "http://localhost:8080/EbayApp/services";
var parseString = require('xml2js').parseString;
var SimpleNodeLogger = require('simple-node-logger'), opts = {
	logFilePath : 'mylogfile.log',
	timestampFormat : 'YYYY-MM-DD HH:mm:ss.SSS'
}, log = SimpleNodeLogger.createSimpleLogger(opts);
var log = SimpleNodeLogger.createSimpleFileLogger('project.log');
exports.placeOrder = function(req, res) {

	if (req.session.email && req.session.name) {

		credit
				.valiadteCard(
						function(data) {
							if (data.statusCode == 200) {

								var option = {
									ignoredNamespaces : true
								};
								var url = baseURL + "/Advertisements?wsdl";
								var args = {
									userId : req.session.id,
									totalprice : req.session.total

								};
								soap.createClient(url, option, function(err,
										client) {
									client.insertOrder(args, function(err,
											result) {

										if (err)
											throw err;
										else {
											var currentCart = req.session.cartItems;
											var updatedQty;
											for (var index = 0; index < currentCart.length; index++) {
												updatedQty = currentCart[index].itemquantity
												- currentCart[index].quantity;
												
												var args = {
														id : result.insertOrderReturn,
														cart_id : currentCart[index].id,
														quantity : currentCart[index].quantity,
														updatedQty : updatedQty
														

													};
												
												client.placeOrder(args, function(err,
														result) {
													

													req.session.cartItems = [];
													log
															.info("The user "
																	+ req.session.id
																	+ "placed an order");
													json_responses = {
														"statusCode" : 200
													};
													res
															.send(json_responses);
												
													
												});
												
											}

										}

									});
								});

								
							} else {
								res.send(data);
							}

						}, req);
		

	} else {
		res.redirect('/');
		// res.render('login', { title: 'Login' });
	}

	// res.send(req.session.cartItems);
};

exports.confirmation = function(req, res) {
	// Checks before redirecting whether the session is valid
	if (req.session.email && req.session.name) {
		// Set these headers to notify the browser not to maintain any cache for
		// the page being loaded
		// res.header('Cache-Control', 'no-cache, private, no-store,
		// must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("orderconfirmation", {
			name : req.session.name,
			lastlogin : req.session.lastlogin
		});
	} else {
		res.redirect('/');
		// res.render('login', { title: 'Login' });
	}
};
