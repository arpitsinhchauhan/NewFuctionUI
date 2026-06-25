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
import javax.persistence.OneToOne;
import javax.persistence.Table;

/**
 *
 * @author Dell
 */
@Entity
@Table(name = "dip")
public class DipStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "date")
    private String date;
    @Column(name = "petroldip")
    private String petroldip;
    @Column(name = "pvalue")
    private double pvalue;
    @Column(name = "dieseldip")
    private String dieseldip;
    @Column(name = "dvalue")
    private double dvalue;
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

    public String getPetroldip() {
        return petroldip;
    }

    public void setPetroldip(String petroldip) {
        this.petroldip = petroldip;
    }

    public String getDieseldip() {
        return dieseldip;
    }

    public void setDieseldip(String dieseldip) {
        this.dieseldip = dieseldip;
    }

    public double getPvalue() {
        return pvalue;
    }

    public void setPvalue(double pvalue) {
        this.pvalue = pvalue;
    }

    public double getDvalue() {
        return dvalue;
    }

    public void setDvalue(double dvalue) {
        this.dvalue = dvalue;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

}
