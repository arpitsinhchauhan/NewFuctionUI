package pumpManagment.Entity;

import java.util.Map;
import pumpManagment.model.UserPumpDTO;

public class ApiResponse<T>  {

    private String message;
    private Object data;
    private boolean success;

      public ApiResponse(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public ApiResponse(String message) {
        this.success = false;
        this.message = message;
        this.data = null;
    }

    public ApiResponse(Object data) {
        this.data = data;
    }


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    
}
