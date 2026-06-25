/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.controller;

import java.io.InputStream;
import java.util.Properties;

/**
 *
 * @author Dell
 */
public class DBConfig {

    public static Properties loadDatabaseProperties() {
        Properties properties = new Properties();
        try (InputStream input = DBConfig.class.getClassLoader().getResourceAsStream("application.properties")) {
            if (input == null) {
                throw new RuntimeException("application.properties file not found in classpath");
            }
            properties.load(input);
        } catch (Exception e) {
            throw new RuntimeException("Error loading database properties", e);
        }
        return properties;
    }
}
