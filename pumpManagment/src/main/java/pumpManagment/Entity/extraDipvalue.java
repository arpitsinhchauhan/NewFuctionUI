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
@Table(name = "extradipvalue")
public class extraDipvalue {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "extra_volume")
    private double extra_volume;
    @Column(name = "extra_diff")
    private double extra_diff;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public double getExtra_volume() {
        return extra_volume;
    }

    public void setExtra_volume(double extra_volume) {
        this.extra_volume = extra_volume;
    }

    public double getExtra_diff() {
        return extra_diff;
    }

    public void setExtra_diff(double extra_diff) {
        this.extra_diff = extra_diff;
    }
}
