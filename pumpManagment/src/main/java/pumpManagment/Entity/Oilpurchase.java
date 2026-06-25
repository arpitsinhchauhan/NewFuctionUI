package pumpManagment.Entity;

import javax.persistence.*;

@Entity
@Table(name = "oilpurchase")
public class Oilpurchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "date")
    private String date;
    @Column(name = "type")
    private String type;
    @Column(name = "quantity")
    private String Quantity;
    @Column(name = "user_id")
    private String userId;

    @Column(name = "vendor_name")
    private String vendorName;
    @Column(name = "sku_name")
    private String skuName;
    @Column(name = "sku_number")
    private String skuNumber;
    @Column(name = "hsn")
    private String hsn;
    @Column(name = "mrp")
    private Double mrp;
    @Column(name = "qty_ltr_or_kg")
    private Double qtyLtrOrKg;
    @Column(name = "unit")
    private String unit;
    @Column(name = "rate")
    private Double rate;
    @Column(name = "net_total")
    private Double netTotal;
    @Column(name = "discount")
    private Double discount;
    @Column(name = "taxable_value")
    private Double taxableValue;
    @Column(name = "gst_percentage")
    private Double gstPercentage;
    @Column(name = "gst_amount")
    private Double gstAmount;
    @Column(name = "cess_percentage")
    private Double cessPercentage;
    @Column(name = "cess_amount")
    private Double cessAmount;
    @Column(name = "net_amount")
    private Double netAmount;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
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


    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getVendorName() {
        return vendorName;
    }

    public void setVendorName(String vendorName) {
        this.vendorName = vendorName;
    }

    public String getSkuName() {
        return skuName;
    }

    public void setSkuName(String skuName) {
        this.skuName = skuName;
    }

    public String getSkuNumber() {
        return skuNumber;
    }

    public void setSkuNumber(String skuNumber) {
        this.skuNumber = skuNumber;
    }

    public String getHsn() {
        return hsn;
    }

    public void setHsn(String hsn) {
        this.hsn = hsn;
    }

    public Double getMrp() {
        return mrp;
    }

    public void setMrp(Double mrp) {
        this.mrp = mrp;
    }

    public Double getQtyLtrOrKg() {
        return qtyLtrOrKg;
    }

    public void setQtyLtrOrKg(Double qtyLtrOrKg) {
        this.qtyLtrOrKg = qtyLtrOrKg;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Double getRate() {
        return rate;
    }

    public void setRate(Double rate) {
        this.rate = rate;
    }

    public Double getNetTotal() {
        return netTotal;
    }

    public void setNetTotal(Double netTotal) {
        this.netTotal = netTotal;
    }

    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    public Double getTaxableValue() {
        return taxableValue;
    }

    public void setTaxableValue(Double taxableValue) {
        this.taxableValue = taxableValue;
    }

    public Double getGstPercentage() {
        return gstPercentage;
    }

    public void setGstPercentage(Double gstPercentage) {
        this.gstPercentage = gstPercentage;
    }

    public Double getGstAmount() {
        return gstAmount;
    }

    public void setGstAmount(Double gstAmount) {
        this.gstAmount = gstAmount;
    }

    public Double getCessPercentage() {
        return cessPercentage;
    }

    public void setCessPercentage(Double cessPercentage) {
        this.cessPercentage = cessPercentage;
    }

    public Double getCessAmount() {
        return cessAmount;
    }

    public void setCessAmount(Double cessAmount) {
        this.cessAmount = cessAmount;
    }

    public Double getNetAmount() {
        return netAmount;
    }

    public void setNetAmount(Double netAmount) {
        this.netAmount = netAmount;
    }
}
