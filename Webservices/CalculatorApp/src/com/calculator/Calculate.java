package com.calculator;

import javax.jws.WebService;

@WebService
public class Calculate {

	public int calculate(String firstOperand, String secondOperand, String operation) {
		int result;
		if (operation.equals("+")) {
			result = Integer.parseInt(firstOperand) + Integer.parseInt(secondOperand);
		} else if (operation.equals("-")) {
			result = Integer.parseInt(firstOperand) - Integer.parseInt(secondOperand);
		} else if (operation.equals("*")) {
			result = Integer.parseInt(firstOperand) * Integer.parseInt(secondOperand);
		} else {
			result = Integer.parseInt(firstOperand) / Integer.parseInt(secondOperand);
		}
		return result;
	}

}
