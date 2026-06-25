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
 * @author Dell
 */
@Entity
@Table(name = "jamabakireport")
public class jamabaki {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    @Column(name = "date")
    private String date;
    @Column(name = "name")
    private String name;
    @Column(name = "jama")
    private double jama;
    @Column(name = "jama_note")
    private String jamaNote;
    @Column(name = "baki")
    private double baki;
    @Column(name = "baki_note")
    private String bakiNote;
    @Column(name = "type")
    private String type;
    @Column(name = "ltr")
    private String ltr;
    @Column(name = "rate")
    private String rate;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getJama() {
        return jama;
    }

    public void setJama(double jama) {
        this.jama = jama;
    }

    public double getBaki() {
        return baki;
    }

    public void setBaki(double baki) {
        this.baki = baki;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getJamaNote() {
        return jamaNote;
    }

    public void setJamaNote(String jamaNote) {
        this.jamaNote = jamaNote;
    }

    public String getBakiNote() {
        return bakiNote;
    }

    public void setBakiNote(String bakiNote) {
        this.bakiNote = bakiNote;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLtr() {
        return ltr;
    }

    public void setLtr(String ltr) {
        this.ltr = ltr;
    }

    public String getRate() {
        return rate;
    }

    public void setRate(String rate) {
        this.rate = rate;
    }
}
