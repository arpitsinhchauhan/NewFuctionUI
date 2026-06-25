/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.model;

/**
 *
 * @author Arpitsinh Chauhan
 */
public class UserNozzleDTO {

    private String firstName;
    private String petrol_nozzle;
    private String diesel_nozzle;
    private String xp_petrol_nozzle;
    private String powe_diesel_nozzle;

    public UserNozzleDTO(String firstName, String petrol_nozzle, String diesel_nozzle, String xp_petrol_nozzle, String powe_diesel_nozzle) {
        this.firstName = firstName;
        this.petrol_nozzle = petrol_nozzle;
        this.diesel_nozzle = diesel_nozzle;
        this.xp_petrol_nozzle = xp_petrol_nozzle;
        this.powe_diesel_nozzle = powe_diesel_nozzle;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getPetrol_nozzle() {
        return petrol_nozzle;
    }

    public void setPetrol_nozzle(String petrol_nozzle) {
        this.petrol_nozzle = petrol_nozzle;
    }

    public String getDiesel_nozzle() {
        return diesel_nozzle;
    }

    public void setDiesel_nozzle(String diesel_nozzle) {
        this.diesel_nozzle = diesel_nozzle;
    }

    public String getXp_petrol_nozzle() {
        return xp_petrol_nozzle;
    }

    public void setXp_petrol_nozzle(String xp_petrol_nozzle) {
        this.xp_petrol_nozzle = xp_petrol_nozzle;
    }

    public String getPowe_diesel_nozzle() {
        return powe_diesel_nozzle;
    }

    public void setPowe_diesel_nozzle(String powe_diesel_nozzle) {
        this.powe_diesel_nozzle = powe_diesel_nozzle;
    }
    
    

}
