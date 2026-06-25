package pumpManagment.Entity;

public interface CustomerReportDTO {
    Integer getIdcustomer();
    String getDate();
    String getName();
    String getEmail();
    String getPhone();
    Integer getUserId();
    Double getTotalJama();
    Double getTotalBaki();
}