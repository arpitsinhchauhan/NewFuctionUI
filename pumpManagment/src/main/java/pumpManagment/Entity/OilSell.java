/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.Entity;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 *
 * @author Dell
 */
@Entity
@Table(name = "oilsell")
public class OilSell {

    @Id
    @GeneratedValue
    private Integer id_oil_sell;
    @Column(name = "date")
    private String date;
    @Column(name = "value")
    private String value;
    @Column(name = "price")
    private String price;
    @Column(name = "oil_sell_note")
    private String oilSellNote;
    @Column(name = "user_id")
    private String userId;
    @Column(name = "customer_name")
    private String customerName;

    public Integer getIdOilSell() {
        return id_oil_sell;
    }

    public void setIdOilSell(Integer idOilSell) {
        this.id_oil_sell = idOilSell;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getOilSellNote() {
        return oilSellNote;
    }

    public void setOilSellNote(String oilSellNote) {
        this.oilSellNote = oilSellNote;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
}
