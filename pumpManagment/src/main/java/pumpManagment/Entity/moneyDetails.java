package pumpManagment.Entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "moneydetails")
@Data
public class moneyDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date")
    private String date;

    @Column(name = "twothousand")
    private Integer twothousand;

    @Column(name = "fivehundred")
    private Integer fivehundred;

    @Column(name = "twohundred")
    private Integer twohundred;

    @Column(name = "onehundred")
    private Integer onehundred;

    @Column(name = "fifty")
    private Integer fifty;

    @Column(name = "twenty")
    private Integer twenty;

    @Column(name = "ten")
    private Integer ten;

    @Column(name = "note")
    private String note;

    @Column(name = "total_case")
    private Integer totalCase;

    @Column(name = "user_id")
    private String userId;

    public moneyDetails() {
        this.id = id;
        this.date = date;
        this.twothousand = twothousand;
        this.fivehundred = fivehundred;
        this.twohundred = twohundred;
        this.onehundred = onehundred;
        this.fifty = fifty;
        this.twenty = twenty;
        this.ten = ten;
        this.note = note;
        this.userId = userId;
        this.totalCase = totalCase;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Integer getTwothousand() {
        return twothousand;
    }

    public void setTwothousand(Integer twothousand) {
        this.twothousand = twothousand;
    }

    public Integer getFivehundred() {
        return fivehundred;
    }

    public void setFivehundred(Integer fivehundred) {
        this.fivehundred = fivehundred;
    }

    public Integer getTwohundred() {
        return twohundred;
    }

    public void setTwohundred(Integer twohundred) {
        this.twohundred = twohundred;
    }

    public Integer getOnehundred() {
        return onehundred;
    }

    public void setOnehundred(Integer onehundred) {
        this.onehundred = onehundred;
    }

    public Integer getFifty() {
        return fifty;
    }

    public void setFifty(Integer fifty) {
        this.fifty = fifty;
    }

    public Integer getTwenty() {
        return twenty;
    }

    public void setTwenty(Integer twenty) {
        this.twenty = twenty;
    }

    public Integer getTen() {
        return ten;
    }

    public void setTen(Integer ten) {
        this.ten = ten;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Integer getTotalCase() {
        return totalCase;
    }

    public void setTotalCase(Integer totalCase) {
        this.totalCase = totalCase;
    }
}
