package com.login;

import javax.jws.WebService;

@WebService
public class Validate 
{
	public boolean validate(String username, String password){
		if(username.equals("test") && password.equals("test"))
			return true;
		return false;
	}
	
	
	

}
