/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.Entity;

import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

/**
 *
 * @author Arpitsinh Chauhan
 */
@Entity
@Table(name = "xppetrol")
public class xpPetrol {
    
    @Id
    @GeneratedValue
    private Integer id;

    @Column(name = "date")
    private String date;

    @Column(name = "pump")
    private String pump;

    @Column(name = "close_meter")
    private String close_meter;

    @Column(name = "open_meter")
    private String open_meter;

    @Column(name = "total")
    private String total;

    @Column(name = "testing")
    private String testing;

    @Column(name = "xppetrol_ltr")
    private String xppetrol_ltr;

    @Column(name = "rate")
    private String rate;

    @Column(name = "total_sell")
    private String total_sell;

    @Column(name = "user_id")
    private String userId;
    
     @Transient
    private List<xpPetrol> rows;

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

    public String getPump() {
        return pump;
    }

    public void setPump(String pump) {
        this.pump = pump;
    }

    public String getClose_meter() {
        return close_meter;
    }

    public void setClose_meter(String close_meter) {
        this.close_meter = close_meter;
    }

    public String getOpen_meter() {
        return open_meter;
    }

    public void setOpen_meter(String open_meter) {
        this.open_meter = open_meter;
    }

    public String getTotal() {
        return total;
    }

    public void setTotal(String total) {
        this.total = total;
    }

    public String getTesting() {
        return testing;
    }

    public void setTesting(String testing) {
        this.testing = testing;
    }

    public String getXppetrol_ltr() {
        return xppetrol_ltr;
    }

    public void setXppetrol_ltr(String xppetrol_ltr) {
        this.xppetrol_ltr = xppetrol_ltr;
    }

    public String getRate() {
        return rate;
    }

    public void setRate(String rate) {
        this.rate = rate;
    }

    public String getTotal_sell() {
        return total_sell;
    }

    public void setTotal_sell(String total_sell) {
        this.total_sell = total_sell;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<xpPetrol> getRows() {
        return rows;
    }

    public void setRows(List<xpPetrol> rows) {
        this.rows = rows;
    }
    
    

    
}
