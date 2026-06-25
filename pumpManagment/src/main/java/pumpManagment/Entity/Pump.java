package pumpManagment.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "pumps")
public class Pump {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pump_id")
    private Long pumpId;

    @Column(name = "pump_name", nullable = false)
    private String pumpName;

    @Column(name = "location", nullable = false)
    private String location;

    public Long getPumpId() {
        return pumpId;
    }

    public void setPumpId(Long pumpId) {
        this.pumpId = pumpId;
    }

    public String getPumpName() {
        return pumpName;
    }

    public void setPumpName(String pumpName) {
        this.pumpName = pumpName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
