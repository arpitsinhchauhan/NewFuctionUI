package pumpManagment.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "feedbackdata")
public class feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer idFeedbackdata;
    @Column(name = "username")
    private String username;
    @Column(name = "email")
    private String email;
    @Column(name = "message")
    private String message;
    @Column(name = "rating")
    private String rating;

    public Integer getIdFeedbackdata() {
        return idFeedbackdata;
    }

    public void setIdFeedbackdata(Integer idFeedbackdata) {
        this.idFeedbackdata = idFeedbackdata;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

}
