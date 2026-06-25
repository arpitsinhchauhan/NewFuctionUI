package pumpManagment.Entity;

import javax.persistence.*;

@Entity
@Table(name = "oilselllist")
public class OilsellList {


    @Id
    @GeneratedValue
    private Integer id;
    @Column(name = "oil_sell_list")
    private String OilSellList;
    @Column(name = "user_id")
    private String userId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getOilSellList() {
        return OilSellList;
    }

    public void setOilSellList(String oilSellList) {
        OilSellList = oilSellList;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
