/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.Entity;

/**
 *
 * @author Dell
 */
public class Item {

    private int idkharch;
    private String notes;
    private double price;

    public int getIdkharch() {
        return idkharch;
    }

    public void setIdkharch(int idkharch) {
        this.idkharch = idkharch;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
