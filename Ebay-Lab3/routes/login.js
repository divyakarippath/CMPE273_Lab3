/**
 * New node file
 */

var soap = require('soap');
var baseURL = "http://localhost:8080/EbayApp/services";
var parseString = require('xml2js').parseString;
var CryptoJS = require("crypto-js");
var SimpleNodeLogger = require('simple-node-logger'), opts = {
	logFilePath : 'mylogfile.log',
	timestampFormat : 'YYYY-MM-DD HH:mm:ss.SSS'
}, log = SimpleNodeLogger.createSimpleLogger(opts);
var log = SimpleNodeLogger.createSimpleFileLogger('project.log');
exports.checkLogin = function(req, res) {
	// These two variables come from the form on
	// the views/login.hbs page

	var json_responses;

	var option = {
		ignoredNamespaces : true
	};
	var url = baseURL + "/Login?wsdl";
	var args = {
		email : req.param("email"),
		password : req.param("password")
	};
	soap
			.createClient(
					url,
					option,
					function(err, client) {
						client
								.checkLogin(
										args,
										function(err, result) {

											var xml = result.checkLoginReturn;
											parseString(
													xml,
													function(err, output) {

														if (output.results.result == undefined) {
															console
																	.log("false");

															json_responses = {
																"statusCode" : 401
															};
															res
																	.send(json_responses);

														} else {
															console.log("true");
															console
																	.log(output.results.result[0].$.email);

															var pwd = output.results.result[0].$.password;
															var bytes = CryptoJS.AES
																	.decrypt(
																			pwd
																					.toString(),
																			'ebay_divya');
															var plaintext = bytes
																	.toString(CryptoJS.enc.Utf8);
															console
																	.log(plaintext);
															if (plaintext == req
																	.param("password")) {
																req.session.email = output.results.result[0].$.email;
																req.session.name = output.results.result[0].$.firstname;
																req.session.lastname = output.results.result[0].$.lastname;
																req.session.id = output.results.result[0].$.user_id;
																req.session.birthday = output.results.result[0].$.birthday;
																req.session.mob = output.results.result[0].$.mobile;
																req.session.location = output.results.result[0].$.city
																		+ ", "
																		+ output.results.result[0].$.state;
																var lastlogdt = output.results.result[0].$.lastlogin;
																if (lastlogdt != null) {
																	req.session.lastlogin = lastlogdt
																			.substring(
																					0,
																					25);
																} else {
																	req.session.lastlogin = '';
																}
																log
																		.info("Login successfulfor the user, "
																				+ output.results.result[0].$.user_id);
																json_responses = {
																	"statusCode" : 200
																};
																res
																		.send(json_responses);
															} else {
																json_responses = {
																	"statusCode" : 401
																};
																res
																		.send(json_responses);
															}

														}

													});

										});
					});

};

exports.register = function(req, res) {
	// These two variables come from the form on
	// the views/login.hbs page
	var email = req.param("email");
	var password = req.param("password");
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var mob = req.param("mob");
	var birthday = req.param("birthday");
	var city = req.param("city");
	var state = req.param("state");
	var country = req.param("country");
	var street = req.param("street");
	var zip = req.param("zip");
	var json_responses = [];
	var dt = new Date();
	var ciphertext = CryptoJS.AES.encrypt(password, 'ebay_divya');
	console.log(typeof (ciphertext.toString()));
	var option = {
		ignoredNamespaces : true
	};
	var url = baseURL + "/Login?wsdl";
	var args = {
		email : email,
		ciphertext : ciphertext.toString(),
		firstname : firstname,
		lastname : lastname,
		mob : mob,
		dt : dt.toString(),
		birthday : birthday,
		street : street,
		city : city,
		state : state,
		country : country,
		zip : zip

	};
	console.log("1");

	soap.createClient(url, option, function(err, client) {
		client.register(args, function(err, result) {

			// output.results.result[0].$.email
			console.log("After registering");
			req.session.email = email;
			req.session.name = firstname;
			req.session.lastname = lastname;
			req.session.id = result.registerReturn;
			req.session.birthday = birthday;
			req.session.mob = mob;
			req.session.location = city + ", " + state;
			req.session.lastlogin = dt.toString().substring(0, 25);
			json_responses = {
				"statusCode" : 200
			};
			res.send(json_responses);

		});
	});

};

exports.redirectToHomepage = function(req, res) {
	// Checks before redirecting whether the session is valid
	if (req.session.email && req.session.name) {
		// Set these headers to notify the browser not to maintain any cache for
		// the page being loaded
		log.info("The user " + req.session.id + "accessing /homepage");
		res
				.header(
						'Cache-Control',
						'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("homepage", {
			name : req.session.name,
			lastlogin : req.session.lastlogin
		});
	} else {
		log.info("Session expired for the user " + req.session.id);
		res.redirect('/');
		// res.render('login', { title: 'Login' });
	}
};

exports.userprofile = function(req, res) {
	// Checks before redirecting whether the session is valid
	if (req.session.email && req.session.name) {
		// Set these headers to notify the browser not to maintain any cache for
		// the page being loaded
		/*
		 * res .header( 'Cache-Control', 'no-cache, private, no-store,
		 * must-revalidate, max-stale=0, post-check=0, pre-check=0');
		 */
		log.info("The user " + req.session.id + "accessing /userprofile");
		res.render("profilepage", {
			email : req.session.email,
			birthday : req.session.birthday,
			mob : req.session.mob,
			location : req.session.location,
			name : req.session.name,
			lastname : req.session.lastname,
			lastlogin : req.session.lastlogin
		});
	} else {
		res.redirect('/');
		// res.render('login', { title: 'Login' });
	}
};

exports.logout = function(req, res) {
	log.info("The user " + req.session.id + "logging out");
	var dt = new Date();

	var option = {
		ignoredNamespaces : true
	};
	var url = baseURL + "/Login?wsdl";
	var args = {
		userId : req.session.id,
		date : dt.toString()
	};

	soap.createClient(url, option, function(err, client) {
		client.logout(args, function(err, result) {
			req.session.destroy();
			res.redirect('/');

		});
	});

};
