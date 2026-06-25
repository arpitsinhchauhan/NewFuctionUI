/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package pumpManagment.Entity;

import javax.persistence.*;

/**
 *
 * @author Dell
 */
@Entity
@Table(name = "powerdieseldailystock")
public class powerdieseldailystock {

 
@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "date")
    private String date;
    @Column(name = "power_ugadto_stock")
    private double power_ugadto_stock;
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

    public double getPower_ugadto_stock() {
        return power_ugadto_stock;
    }

    public void setPower_ugadto_stock(double power_ugadto_stock) {
        this.power_ugadto_stock = power_ugadto_stock;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
