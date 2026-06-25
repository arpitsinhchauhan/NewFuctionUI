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
@Table(name = "xpdailystock")
public class xpdailystock {

 @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "date")
    private String date;
    @Column(name = "xp_ugadto_stock")
    private double xp_ugadto_stock;
    @Column(name = "user_id")
    private String userId;

   public String getDate() {
      return date;
   }

   public void setDate(String date) {
      this.date = date;
   }

   public Integer getId() {
      return id;
   }

   public void setId(Integer id) {
      this.id = id;
   }

    public double getXp_ugadto_stock() {
        return xp_ugadto_stock;
    }

    public void setXp_ugadto_stock(double xp_ugadto_stock) {
        this.xp_ugadto_stock = xp_ugadto_stock;
    }

    public String getUserId() {
      return userId;
   }

   public void setUserId(String userId) {
      this.userId = userId;
   }
}
