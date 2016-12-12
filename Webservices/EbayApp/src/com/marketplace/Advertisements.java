package com.marketplace;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.jws.WebService;

@WebService
public class Advertisements {
	Connection con = null;
	Statement st = null;
	int rs;
	String url = "jdbc:mysql://localhost:3306/ebay";
	String user = "root";
	String password = "root";
	
	public boolean additem(int userId,String itemname, String itemdesc,  String itemprice, int itemquantity, String pricetype) throws ClassNotFoundException, SQLException {

		String insertItem = "insert into advertisements(userid,itemname,itemdesc,itemprice,itemquantity,pricetype) values('"
				+ userId
				+ "','"
				+ itemname
				+ "','"
				+ itemdesc
				+ "','"
				+ itemprice + "'," + itemquantity + ",'" + pricetype + "')";
		Class.forName("com.mysql.jdbc.Driver");
        con = DriverManager.getConnection(url, user, password);
        st = con.createStatement();
        rs = st.executeUpdate(insertItem);
        
        return true;

    }
	
	public String getAuctionAdvertisements() throws ClassNotFoundException, SQLException {

		String getAuctionAdvertisements = "select * from members INNER JOIN advertisements ON members.user_id = advertisements.userid where advertisements.pricetype='Auction'";
		Class.forName("com.mysql.jdbc.Driver");
        con = DriverManager.getConnection(url, user, password);
        st = con.createStatement();
       
        ResultSet rs = st.executeQuery(getAuctionAdvertisements);
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
	
	public String getFixedpriceAdvertisements() throws ClassNotFoundException, SQLException {

		String getFixedpriceAdvertisements = "select * from members INNER JOIN advertisements ON members.user_id = advertisements.userid where advertisements.pricetype='FixedPrice'";
		
		Class.forName("com.mysql.jdbc.Driver");
        con = DriverManager.getConnection(url, user, password);
        st = con.createStatement();
       
        ResultSet rs = st.executeQuery(getFixedpriceAdvertisements);
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
	
	public boolean addBid(int userId,int ad_id, int quantity, int price) throws ClassNotFoundException, SQLException {

		String insertBid = "insert into bids(user_id,ad_id,quantity,price) values("
				+ userId
				+ ","
				+ ad_id
				+ ","
				+ quantity
				+ "," + price + ")";
		
		Class.forName("com.mysql.jdbc.Driver");
        con = DriverManager.getConnection(url, user, password);
        st = con.createStatement();
        rs = st.executeUpdate(insertBid);
        
        return true;
        
   

    }
	
	public int insertOrder(int userId,int totalprice) throws ClassNotFoundException, SQLException {

		String insertOrder = "insert into orders(user_id,totalprice) values("
				+ userId
				+ ","
				+ totalprice + ")";
		
		Class.forName("com.mysql.jdbc.Driver");
        con = DriverManager.getConnection(url, user, password);
        st = con.createStatement();
        rs = st.executeUpdate(insertOrder,Statement.RETURN_GENERATED_KEYS);
        
        return rs;
        
   

    }
	
	public boolean placeOrder(int id,int cart_id, int quantity, int updatedQty) throws ClassNotFoundException, SQLException {

		String insertOrderItem = "insert into orderitems(order_id,ad_id,quantity) values("
				+ id
				+ ","
				+ cart_id
				+ ","
				+ quantity
				+ ")";

		String updateAdvertisement = "update advertisements set itemquantity= "
				+ updatedQty
				+ " where id="
				+ cart_id;
		
		Class.forName("com.mysql.jdbc.Driver");
        con = DriverManager.getConnection(url, user, password);
        st = con.createStatement();
        rs = st.executeUpdate(insertOrderItem);
        int rs1 = st.executeUpdate(updateAdvertisement);
        
        return true;
        
   

    }
	
	

}
