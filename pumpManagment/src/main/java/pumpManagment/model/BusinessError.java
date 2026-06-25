package pumpManagment.model;/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import java.util.Arrays;

public class BusinessError {
    int code;
    String message;
    String[] params;
    String exceptionMessage;

    public BusinessError(int code, String message, String... params){
        this.code = code;
        this.message = message;
        if (params != null && params.length > 0) {
            this.params = params;
        } else {
            this.params = null;
        }
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String[] getParams() {
        return params;
    }

    public void setParams(String[] params) {
        this.params = params;
    }

    public String getExceptionMessage() {
        return exceptionMessage;
    }

    public void setExceptionMessage(String exceptionMessage) {
        this.exceptionMessage = exceptionMessage;
    }

    @Override
    public String toString() {
        String extra = (params == null || params.length == 0) ? "" : ", params=" + Arrays.toString(params);
        return "BusinessError{" + "code=" + code + ", message=" + message + extra + ", exceptionMessage=" + exceptionMessage + '}';
    }


}
