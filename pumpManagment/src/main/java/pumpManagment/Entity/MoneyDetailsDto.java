package pumpManagment.Entity;

import lombok.Data;
import java.util.List;

@Data
public class MoneyDetailsDto {

    private String note;
    private Integer totalCaseCase;
    private List<Denomination> denominations;
    private String userId;
    private String date;

    @Data
    public static class Denomination {

        private String value;
        private Integer total;
        private Integer count;

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public Integer getTotal() {
            return total;
        }

        public void setTotal(Integer total) {
            this.total = total;
        }

        public Integer getCount() {
            return count;
        }

        public void setCount(Integer count) {
            this.count = count;
        }
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Integer getTotalCaseCase() {
        return totalCaseCase;
    }

    public void setTotalCaseCase(Integer totalCaseCase) {
        this.totalCaseCase = totalCaseCase;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<Denomination> getDenominations() {
        return denominations;
    }

    public void setDenominations(List<Denomination> denominations) {
        this.denominations = denominations;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

}
