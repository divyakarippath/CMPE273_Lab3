package com.profile;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.jws.WebService;

@WebService
public class Profile {
	Connection con = null;
	Statement st = null;
	int rs;
	String url = "jdbc:mysql://localhost:3306/ebay";
	String user = "root";
	String password = "root";

	public String getOrders(int userId) throws ClassNotFoundException, SQLException {

		String getOrders = "select * from orders where user_id =" + userId;
		Class.forName("com.mysql.jdbc.Driver");
		con = DriverManager.getConnection(url, user, password);
		st = con.createStatement();
		int ordId = 0;
		ResultSet rs = st.executeQuery(getOrders);
		while (rs.next()) {
			ordId = rs.getInt(1);
			
			
		}
		System.out.println(ordId);
		String getOrderitems = "select * from orderitems inner join advertisements on orderitems.ad_id = advertisements.id inner join members on members.user_id = advertisements.userid where orderitems.order_id = "
				+ ordId;
		ResultSet rs1 = st.executeQuery(getOrderitems);
		
		StringBuffer xmlArray = new StringBuffer("<results>");
		while (rs1.next()) {
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

	public String getSoldItems(int userId) throws ClassNotFoundException, SQLException {

		String getSoldItems = "select * from orderitems inner join advertisements on orderitems.ad_id = advertisements.id where advertisements.userid="
				+ userId;

		Class.forName("com.mysql.jdbc.Driver");
		con = DriverManager.getConnection(url, user, password);
		st = con.createStatement();

		ResultSet rs = st.executeQuery(getSoldItems);
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

}
