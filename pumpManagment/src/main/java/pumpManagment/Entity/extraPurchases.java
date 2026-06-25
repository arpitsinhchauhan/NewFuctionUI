/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 *
 * @author Arpitsinh Chauhan
 */
@Entity
@Table(name = "extrapurchases")
public class extraPurchases {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "date")
    private String date;
    @Column(name = "extra_type")
    private String extraType;
    @Column(name = "extra_quantity")
    private String extra_quantity;
    @Column(name = "extra_total")
    private String extra_total;
    @Column(name = "extra_vat")
    private String extra_vat;
    @Column(name = "extra_cess")
    private String extra_cess;
    @Column(name = "extra_jtcpercentage")
    private String extra_jtcpercentage;
    @Column(name = "extra_total_purchase")
    private double extra_total_purchase;
    @Column(name = "user_id")
    private String userId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getExtraType() {
        return extraType;
    }

    public void setExtraType(String extraType) {
        this.extraType = extraType;
    }

    

    public String getExtra_quantity() {
        return extra_quantity;
    }

    public void setExtra_quantity(String extra_quantity) {
        this.extra_quantity = extra_quantity;
    }

    public String getExtra_total() {
        return extra_total;
    }

    public void setExtra_total(String extra_total) {
        this.extra_total = extra_total;
    }

    public String getExtra_vat() {
        return extra_vat;
    }

    public void setExtra_vat(String extra_vat) {
        this.extra_vat = extra_vat;
    }

    public String getExtra_cess() {
        return extra_cess;
    }

    public void setExtra_cess(String extra_cess) {
        this.extra_cess = extra_cess;
    }

    public String getExtra_jtcpercentage() {
        return extra_jtcpercentage;
    }

    public void setExtra_jtcpercentage(String extra_jtcpercentage) {
        this.extra_jtcpercentage = extra_jtcpercentage;
    }

    public double getExtra_total_purchase() {
        return extra_total_purchase;
    }

    public void setExtra_total_purchase(double extra_total_purchase) {
        this.extra_total_purchase = extra_total_purchase;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

   

    
    
}
