/**
 * New node file
 */
var soap = require('soap');
var baseURL = "http://localhost:8080/CalculatorApp/services";

exports.calculate = function(req, res) {
	// These two variables come from the form on
	// the views/login.hbs page
	
	var json_responses;

	var option = {
		ignoredNamespaces : true
	};
	var url = baseURL + "/Calculate?wsdl";
	var args = {
		firstOperand : req.param("firstOperand"),
		secondOperand : req.param("secondOperand"),
		operation : req.param("operation")
	};
	soap.createClient(url, option, function(err, client) {
		client.calculate(args, function(err, result) {
			console.log(result);
			json_responses = {
				"result" : result.calculateReturn
			};
			res.send(json_responses);

		});
	});

};
