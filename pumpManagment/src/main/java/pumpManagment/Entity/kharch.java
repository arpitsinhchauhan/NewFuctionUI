/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.Entity;

import java.util.ArrayList;
import java.util.Date;
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
@Table(name = "kharch")
public class kharch {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer idkharch;
    @Column(name = "date")
    private String date;
    @Column(name = "notes")
    private String notes;
    @Column(name = "price")
    private String price;
    @Column(name = "expenses")
    private String expenses;
    @Column(name = "user_id")
    private String userId;

    public Integer getIdkharch() {
        return idkharch;
    }

    public void setIdkharch(Integer idkharch) {
        this.idkharch = idkharch;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getExpenses() {
        return expenses;
    }

    public void setExpenses(String expenses) {
        this.expenses = expenses;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

}
