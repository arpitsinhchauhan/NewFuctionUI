package pumpManagment.Entity;

import javax.persistence.*;

@Entity
@Table(name = "xppetrolgatt")
public class XpPetrolgatt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "date")
    private String date;
    @Column(name = "xppetrolgatt")
    private double xppetrolgatt;
    @Column(name = "user_id")
    private String userId;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public double getXppetrolgatt() {
        return xppetrolgatt;
    }

    public void setXppetrolgatt(double xppetrolgatt) {
        this.xppetrolgatt = xppetrolgatt;
    }

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
}
