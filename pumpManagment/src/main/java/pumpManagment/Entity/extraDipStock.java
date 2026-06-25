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
@Table(name = "extradip")
public class extraDipStock {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "date")
    private String date;
    @Column(name = "extra_petroldip")
    private String extra_petroldip;
    @Column(name = "extra_pvalue")
    private double extra_pvalue;
    @Column(name = "extra_dieseldip")
    private String extra_dieseldip;
    @Column(name = "extra_dvalue")
    private double extra_dvalue;
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

    public String getExtra_petroldip() {
        return extra_petroldip;
    }

    public void setExtra_petroldip(String extra_petroldip) {
        this.extra_petroldip = extra_petroldip;
    }

    public double getExtra_pvalue() {
        return extra_pvalue;
    }

    public void setExtra_pvalue(double extra_pvalue) {
        this.extra_pvalue = extra_pvalue;
    }

    public String getExtra_dieseldip() {
        return extra_dieseldip;
    }

    public void setExtra_dieseldip(String extra_dieseldip) {
        this.extra_dieseldip = extra_dieseldip;
    }

    public double getExtra_dvalue() {
        return extra_dvalue;
    }

    public void setExtra_dvalue(double extra_dvalue) {
        this.extra_dvalue = extra_dvalue;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}