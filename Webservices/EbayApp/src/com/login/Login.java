package com.login;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.jws.WebService;

@WebService
public class Login {
	Connection con = null;
	Statement st = null;
	int rs;
	String url = "jdbc:mysql://localhost:3306/ebay";
	String user = "root";
	String password = "root";

	public String checkLogin(String email, String password) throws SQLException, ClassNotFoundException {

		Class.forName("com.mysql.jdbc.Driver");
		Connection con = (Connection) DriverManager
				.getConnection("jdbc:mysql://localhost:3306/ebay?user=root&password=root");
		//con = DriverManager.getConnection(url, user, password);

		Statement stmt = (Statement) con.createStatement();

		ResultSet rs = stmt.executeQuery("select * from members where email='" + email + "'");
		StringBuffer xmlArray = new StringBuffer("<results>");
		while (rs.next()) {
			int total_rows = rs.getMetaData().getColumnCount();
			xmlArray.append("<result ");
			for (int i = 0; i < total_rows; i++) {
				xmlArray.append(
						" " + rs.getMetaData().getColumnLabel(i + 1).toLowerCase() + "='" + rs.getObject(i + 1) + "'");
			}
			xmlArray.append(" />");
		}
		xmlArray.append("</results>");
		return xmlArray.toString();

	}

	public int register(String email,String ciphertext,String firstname,String lastname,String mob,String dt,String birthday,String street,String city,String state,String country,String zip) throws ClassNotFoundException, SQLException {
		
		String insertUser = "insert into members(email,password,firstname,lastname,mobile,lastlogin,birthday,street,city,state,country,zip) values('"
				+ email
				+ "','"
				+ ciphertext
				+ "','"
				+ firstname
				+ "','"
				+ lastname
				+ "','" + mob + "','" + dt + "','"
				+ birthday
				+ "','" +street+ "','" + city+ "','" +state+ "','" +country+ "','" +zip+"')";
		
		Class.forName("com.mysql.jdbc.Driver");
        con = DriverManager.getConnection(url, user, password);
        st = con.createStatement();
        rs = st.executeUpdate(insertUser,Statement.RETURN_GENERATED_KEYS);
        return rs;
		
		
		
		
		
		
	}

	public boolean logout(String userId, String date) throws ClassNotFoundException, SQLException {
		Class.forName("com.mysql.jdbc.Driver");

		// Connection con = DriverManager.getConnection(url, user,
		// password);
		String updateUser = "update members set lastlogin= '" + date
		+ "' where user_id=" + userId;
		Connection con = (Connection) DriverManager
				.getConnection("jdbc:mysql://localhost:3306/ebay?user=root&password=root");

		Statement stmt = (Statement) con.createStatement();

		stmt.executeQuery(updateUser);
		return true;
	}

}
