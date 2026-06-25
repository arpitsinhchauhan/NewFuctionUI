package pumpManagment.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "purchase")
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "date")
    private String date;
    @Column(name = "type")
    private String type;
    @Column(name = "quantity")
    private String Quantity;
    @Column(name = "total")
    private String Total;
    @Column(name = "vat")
    private String Vat;
    @Column(name = "cess")
    private String Cess;
    @Column(name = "jtcpercentage")
    private String jtcpercentage;
    @Column(name = "total_purchase")
    private double total_purchase;
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

    public void setDate(String Date) {
        date = Date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getQuantity() {
        return Quantity;
    }

    public void setQuantity(String quantity) {
        Quantity = quantity;
    }

    public String getTotal() {
        return Total;
    }

    public void setTotal(String total) {
        Total = total;
    }

    public String getVat() {
        return Vat;
    }

    public void setVat(String vat) {
        Vat = vat;
    }

    public String getCess() {
        return Cess;
    }

    public void setCess(String cess) {
        Cess = cess;
    }

    public double getTotal_purchase() {
        return total_purchase;
    }

    public void setTotal_purchase(double total_purchase) {
        this.total_purchase = total_purchase;
    }

    public String getJtcpercentage() {
        return jtcpercentage;
    }

    public void setJtcpercentage(String jtcpercentage) {
        this.jtcpercentage = jtcpercentage;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

}
