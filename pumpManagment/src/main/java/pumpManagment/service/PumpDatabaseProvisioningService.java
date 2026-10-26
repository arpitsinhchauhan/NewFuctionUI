package pumpManagment.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import pumpManagment.config.DynamicRoutingDataSource;
import pumpManagment.config.MasterDatabaseInitializer;
import pumpManagment.util.PumpDatabaseNamingUtil;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class PumpDatabaseProvisioningService {

    private static final Logger log = LoggerFactory.getLogger(PumpDatabaseProvisioningService.class);

    @Value("${spring.datasource.url:jdbc:mysql://localhost:3306/petrol_pump?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}")
    private String masterJdbcUrl;

    @Value("${spring.datasource.username:root}")
    private String dbUsername;

    @Value("${spring.datasource.password:root}")
    private String dbPassword;

    @Autowired(required = false)
    private DynamicRoutingDataSource dynamicRoutingDataSource;

    /**
     * Complete DDL statements required to create the entire application schema
     * inside any newly created pump database.
     */
    private static final List<String> PUMP_SCHEMA_TABLE_DDL = Arrays.asList(
            "CREATE TABLE IF NOT EXISTS `audit_log` (" +
                    "`id` bigint(20) NOT NULL AUTO_INCREMENT," +
                    "`failure_reason` varchar(255) DEFAULT NULL," +
                    "`ip_address` varchar(255) DEFAULT NULL," +
                    "`login_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP," +
                    "`status` varchar(255) NOT NULL," +
                    "`username` varchar(255) NOT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `company` (" +
                    "`id` bigint(20) NOT NULL AUTO_INCREMENT," +
                    "`active` bit(1) NOT NULL DEFAULT b'1'," +
                    "`name` varchar(255) NOT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `creditlist` (" +
                    "`id` int(11) NOT NULL," +
                    "`credit_list` varchar(255) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `customer` (" +
                    "`idcustomer` int(11) NOT NULL AUTO_INCREMENT," +
                    "`credit_limit` double DEFAULT NULL," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`email` varchar(255) DEFAULT NULL," +
                    "`name` varchar(255) DEFAULT NULL," +
                    "`phone` varchar(255) DEFAULT NULL," +
                    "`status` varchar(255) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "`vehicle_number` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`idcustomer`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `daily_reports` (" +
                    "`report_id` bigint(20) NOT NULL AUTO_INCREMENT," +
                    "`cash` double DEFAULT NULL," +
                    "`created_by` varchar(100) NOT NULL," +
                    "`created_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP," +
                    "`diesel_sales` double DEFAULT NULL," +
                    "`employee_id` bigint(20) NOT NULL," +
                    "`employee_name` varchar(150) DEFAULT NULL," +
                    "`expenses` double DEFAULT NULL," +
                    "`manager_id` bigint(20) DEFAULT NULL," +
                    "`petrol_sales` double DEFAULT NULL," +
                    "`pump_id` bigint(20) NOT NULL," +
                    "`report_date` varchar(50) NOT NULL," +
                    "`report_time` varchar(50) NOT NULL," +
                    "`sales_amount` double DEFAULT NULL," +
                    "`shift` varchar(50) NOT NULL," +
                    "`status` varchar(50) DEFAULT NULL," +
                    "`stock_details` text," +
                    "PRIMARY KEY (`report_id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `dailydieselstock` (" +
                    "`id` int(11) NOT NULL AUTO_INCREMENT," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`dieselopenstock` double DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `dailystock` (" +
                    "`id` int(11) NOT NULL AUTO_INCREMENT," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`openstock` double DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `dailytotal` (" +
                    "`id` int(11) NOT NULL AUTO_INCREMENT," +
                    "`daily_total` double DEFAULT NULL," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `day_closing` (" +
                    "`id` bigint(20) NOT NULL AUTO_INCREMENT," +
                    "`business_date` varchar(255) NOT NULL," +
                    "`card_collection` double DEFAULT NULL," +
                    "`cash_collection` double DEFAULT NULL," +
                    "`closed_by` varchar(255) DEFAULT NULL," +
                    "`closed_time` datetime DEFAULT NULL," +
                    "`created_date` datetime DEFAULT NULL," +
                    "`credit_sales` double DEFAULT NULL," +
                    "`expenses` double DEFAULT NULL," +
                    "`fuel_sales` double DEFAULT NULL," +
                    "`net_collection` double DEFAULT NULL," +
                    "`net_sales_ltr` double DEFAULT NULL," +
                    "`oil_sales` double DEFAULT NULL," +
                    "`opening_cash` double DEFAULT NULL," +
                    "`real_closing_meter` double DEFAULT NULL," +
                    "`real_opening_meter` double DEFAULT NULL," +
                    "`reopen_reason` varchar(1000) DEFAULT NULL," +
                    "`reopened_by` varchar(255) DEFAULT NULL," +
                    "`reopened_time` datetime DEFAULT NULL," +
                    "`status` varchar(255) NOT NULL," +
                    "`total_sales` double DEFAULT NULL," +
                    "`total_testing` double DEFAULT NULL," +
                    "`updated_date` datetime DEFAULT NULL," +
                    "`upi_collection` double DEFAULT NULL," +
                    "`user_id` varchar(255) NOT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `day_closing_audit_log` (" +
                    "`id` bigint(20) NOT NULL AUTO_INCREMENT," +
                    "`action` varchar(255) NOT NULL," +
                    "`business_date` varchar(255) NOT NULL," +
                    "`ip_address` varchar(255) DEFAULT NULL," +
                    "`net_collection` double DEFAULT NULL," +
                    "`performed_by` varchar(255) DEFAULT NULL," +
                    "`performed_role` varchar(255) DEFAULT NULL," +
                    "`reason` varchar(1000) DEFAULT NULL," +
                    "`timestamp` datetime DEFAULT NULL," +
                    "`total_expenses` double DEFAULT NULL," +
                    "`total_sales` double DEFAULT NULL," +
                    "`user_id` varchar(255) NOT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `dieselgatt` (" +
                    "`id` int(11) NOT NULL AUTO_INCREMENT," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`dieselgatt` double DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `dieselsell` (" +
                    "`id` int(11) NOT NULL AUTO_INCREMENT," +
                    "`close_meter` varchar(255) DEFAULT NULL," +
                    "`closed_by` varchar(255) DEFAULT NULL," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`diesel_ltr` varchar(255) DEFAULT NULL," +
                    "`employee_name` varchar(255) DEFAULT NULL," +
                    "`open_meter` varchar(255) DEFAULT NULL," +
                    "`pump` varchar(255) DEFAULT NULL," +
                    "`rate` varchar(255) DEFAULT NULL," +
                    "`shift` varchar(255) DEFAULT NULL," +
                    "`shift_close_time` varchar(255) DEFAULT NULL," +
                    "`shift_status` varchar(255) DEFAULT NULL," +
                    "`testing` varchar(255) DEFAULT NULL," +
                    "`total` varchar(255) DEFAULT NULL," +
                    "`total_sell` varchar(255) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `dip` (" +
                    "`id` int(11) NOT NULL AUTO_INCREMENT," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`dieseldip` varchar(255) DEFAULT NULL," +
                    "`dvalue` double DEFAULT NULL," +
                    "`petroldip` varchar(255) DEFAULT NULL," +
                    "`pvalue` double DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `dipvalue` (" +
                    "`id` int(11) NOT NULL AUTO_INCREMENT," +
                    "`diff` double DEFAULT NULL," +
                    "`volume` double DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `Employee` (" +
                    "`id` int(11) NOT NULL AUTO_INCREMENT," +
                    "`account_number` varchar(255) DEFAULT NULL," +
                    "`employee_id` varchar(255) DEFAULT NULL," +
                    "`name` varchar(255) DEFAULT NULL," +
                    "`phone_number` varchar(255) DEFAULT NULL," +
                    "`photo` longblob," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `expenseslist` (" +
                    "`id` int(11) NOT NULL AUTO_INCREMENT," +
                    "`expenses_list` varchar(255) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `extradip` (" +
                    "`id` int(11) NOT NULL AUTO_INCREMENT," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`extra_dieseldip` varchar(255) DEFAULT NULL," +
                    "`extra_dvalue` double DEFAULT NULL," +
                    "`extra_petroldip` varchar(255) DEFAULT NULL," +
                    "`extra_pvalue` double DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `extradipvalue` (" +
                    "`id` int(11) NOT NULL AUTO_INCREMENT," +
                    "`extra_diff` double DEFAULT NULL," +
                    "`extra_volume` double DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `extrapurchases` (" +
                    "`id` int(11) NOT NULL AUTO_INCREMENT," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`extra_type` varchar(255) DEFAULT NULL," +
                    "`extra_cess` varchar(255) DEFAULT NULL," +
                    "`extra_jtcpercentage` varchar(255) DEFAULT NULL," +
                    "`extra_quantity` varchar(255) DEFAULT NULL," +
                    "`extra_total` varchar(255) DEFAULT NULL," +
                    "`extra_total_purchase` double DEFAULT NULL," +
                    "`extra_vat` varchar(255) DEFAULT NULL," +
                    "`invoice_number` varchar(100) DEFAULT NULL," +
                    "`pump_id` bigint(20) DEFAULT NULL," +
                    "`sku_number` varchar(255) DEFAULT NULL," +
                    "`supplier` varchar(150) DEFAULT NULL," +
                    "`tanker_number` varchar(50) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `feedbackdata` (" +
                    "`id_feedbackdata` int(11) NOT NULL AUTO_INCREMENT," +
                    "`email` varchar(255) DEFAULT NULL," +
                    "`message` varchar(255) DEFAULT NULL," +
                    "`rating` varchar(255) DEFAULT NULL," +
                    "`username` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id_feedbackdata`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `hibernate_sequence` (" +
                    "`next_val` bigint(20) DEFAULT NULL" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `images` (" +
                    "`id` bigint(20) NOT NULL," +
                    "`image_data` longblob NOT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `jamabakireport` (" +
                    "`id` int(11) NOT NULL," +
                    "`baki` double DEFAULT NULL," +
                    "`baki_note` varchar(255) DEFAULT NULL," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`jama` double DEFAULT NULL," +
                    "`jama_note` varchar(255) DEFAULT NULL," +
                    "`ltr` varchar(255) DEFAULT NULL," +
                    "`name` varchar(255) DEFAULT NULL," +
                    "`rate` varchar(255) DEFAULT NULL," +
                    "`type` varchar(255) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `kharch` (" +
                    "`idkharch` int(11) NOT NULL," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`expenses` varchar(255) DEFAULT NULL," +
                    "`notes` varchar(255) DEFAULT NULL," +
                    "`price` varchar(255) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`idkharch`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `loclcredit` (" +
                    "`id` int(11) NOT NULL," +
                    "`balance` varchar(255) DEFAULT NULL," +
                    "`credit` varchar(255) DEFAULT NULL," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`remark` varchar(255) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `moneydetails` (" +
                    "`id` bigint(20) NOT NULL AUTO_INCREMENT," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`fifty` int(11) DEFAULT NULL," +
                    "`fivehundred` int(11) DEFAULT NULL," +
                    "`note` varchar(255) DEFAULT NULL," +
                    "`onehundred` int(11) DEFAULT NULL," +
                    "`ten` int(11) DEFAULT NULL," +
                    "`total_case` int(11) DEFAULT NULL," +
                    "`twenty` int(11) DEFAULT NULL," +
                    "`twohundred` int(11) DEFAULT NULL," +
                    "`twothousand` int(11) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `oilpurchase` (" +
                    "`id` int(11) NOT NULL AUTO_INCREMENT," +
                    "`quantity` varchar(255) DEFAULT NULL," +
                    "`cess_amount` double DEFAULT NULL," +
                    "`cess_percentage` double DEFAULT NULL," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`discount` double DEFAULT NULL," +
                    "`gst_amount` double DEFAULT NULL," +
                    "`gst_percentage` double DEFAULT NULL," +
                    "`hsn` varchar(255) DEFAULT NULL," +
                    "`invoice_number` varchar(100) DEFAULT NULL," +
                    "`mrp` double DEFAULT NULL," +
                    "`net_amount` double DEFAULT NULL," +
                    "`net_total` double DEFAULT NULL," +
                    "`pump_id` bigint(20) DEFAULT NULL," +
                    "`qty_ltr_or_kg` double DEFAULT NULL," +
                    "`rate` double DEFAULT NULL," +
                    "`sku_name` varchar(255) DEFAULT NULL," +
                    "`sku_number` varchar(255) DEFAULT NULL," +
                    "`supplier` varchar(150) DEFAULT NULL," +
                    "`tanker_number` varchar(50) DEFAULT NULL," +
                    "`taxable_value` double DEFAULT NULL," +
                    "`type` varchar(255) DEFAULT NULL," +
                    "`unit` varchar(255) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "`vendor_name` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `oilsell` (" +
                    "`id_oil_sell` int(11) NOT NULL," +
                    "`customer_name` varchar(255) DEFAULT NULL," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`oil_sell_note` varchar(255) DEFAULT NULL," +
                    "`price` varchar(255) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "`value` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id_oil_sell`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `oilselllist` (" +
                    "`id` int(11) NOT NULL," +
                    "`oil_sell_list` varchar(255) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `petrolgatt` (" +
                    "`id` int(11) NOT NULL AUTO_INCREMENT," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`petrolgatt` double DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `petrolsell` (" +
                    "`id` int(11) NOT NULL," +
                    "`close_meter` varchar(255) DEFAULT NULL," +
                    "`closed_by` varchar(255) DEFAULT NULL," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`employee_name` varchar(255) DEFAULT NULL," +
                    "`open_meter` varchar(255) DEFAULT NULL," +
                    "`petrol_ltr` varchar(255) DEFAULT NULL," +
                    "`pump` varchar(255) DEFAULT NULL," +
                    "`rate` varchar(255) DEFAULT NULL," +
                    "`shift` varchar(255) DEFAULT NULL," +
                    "`shift_close_time` varchar(255) DEFAULT NULL," +
                    "`shift_status` varchar(255) DEFAULT NULL," +
                    "`testing` varchar(255) DEFAULT NULL," +
                    "`total` varchar(255) DEFAULT NULL," +
                    "`total_sell` varchar(255) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `powerdiesel` (" +
                    "`id` int(11) NOT NULL AUTO_INCREMENT," +
                    "`close_meter` varchar(255) DEFAULT NULL," +
                    "`closed_by` varchar(255) DEFAULT NULL," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`employee_name` varchar(255) DEFAULT NULL," +
                    "`open_meter` varchar(255) DEFAULT NULL," +
                    "`powerdiesel_ltr` varchar(255) DEFAULT NULL," +
                    "`pump` varchar(255) DEFAULT NULL," +
                    "`rate` varchar(255) DEFAULT NULL," +
                    "`shift` varchar(255) DEFAULT NULL," +
                    "`shift_close_time` varchar(255) DEFAULT NULL," +
                    "`shift_status` varchar(255) DEFAULT NULL," +
                    "`testing` varchar(255) DEFAULT NULL," +
                    "`total` varchar(255) DEFAULT NULL," +
                    "`total_sell` varchar(255) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `powerdieseldailystock` (" +
                    "`id` int(11) NOT NULL AUTO_INCREMENT," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`power_ugadto_stock` double DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `powerdieselgatt` (" +
                    "`id` int(11) NOT NULL AUTO_INCREMENT," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`power_dieselgatt` double DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `pumps` (" +
                    "`pump_id` bigint(20) NOT NULL AUTO_INCREMENT," +
                    "`location` varchar(255) NOT NULL," +
                    "`pump_name` varchar(255) NOT NULL," +
                    "PRIMARY KEY (`pump_id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `purchase` (" +
                    "`id` int(11) NOT NULL AUTO_INCREMENT," +
                    "`cess` varchar(255) DEFAULT NULL," +
                    "`quantity` varchar(255) DEFAULT NULL," +
                    "`total` varchar(255) DEFAULT NULL," +
                    "`vat` varchar(255) DEFAULT NULL," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`invoice_number` varchar(100) DEFAULT NULL," +
                    "`jtcpercentage` varchar(255) DEFAULT NULL," +
                    "`pump_id` bigint(20) DEFAULT NULL," +
                    "`sku_number` varchar(255) DEFAULT NULL," +
                    "`supplier` varchar(150) DEFAULT NULL," +
                    "`tanker_number` varchar(50) DEFAULT NULL," +
                    "`total_purchase` double DEFAULT NULL," +
                    "`type` varchar(255) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `role_security` (" +
                    "`id` bigint(20) NOT NULL AUTO_INCREMENT," +
                    "`active` bit(1) NOT NULL DEFAULT b'1'," +
                    "`role_name` varchar(100) NOT NULL," +
                    "PRIMARY KEY (`id`)," +
                    "UNIQUE KEY `uk_role_name` (`role_name`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `security_policy` (" +
                    "`id` bigint(20) NOT NULL AUTO_INCREMENT," +
                    "`account_lock_duration` int(11) NOT NULL DEFAULT 30," +
                    "`first_login_enabled` bit(1) NOT NULL DEFAULT b'0'," +
                    "`lock_attempt` int(11) NOT NULL DEFAULT 5," +
                    "`password_history` int(11) NOT NULL DEFAULT 3," +
                    "`pwd_exp_days` int(11) NOT NULL DEFAULT 90," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `tank_configuration` (" +
                    "`id` bigint(20) NOT NULL AUTO_INCREMENT," +
                    "`active` bit(1) NOT NULL DEFAULT b'1'," +
                    "`alert_level` double DEFAULT NULL," +
                    "`capacity` double DEFAULT NULL," +
                    "`created_at` datetime DEFAULT NULL," +
                    "`critical_limit` double DEFAULT NULL," +
                    "`fuel_type` varchar(255) NOT NULL," +
                    "`min_stock_level` double DEFAULT NULL," +
                    "`pump_id` bigint(20) DEFAULT NULL," +
                    "`tank_capacity` double DEFAULT NULL," +
                    "`tank_name` varchar(255) DEFAULT NULL," +
                    "`updated_at` datetime DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "`warning_limit` double DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `transaction` (" +
                    "`id` int(11) NOT NULL," +
                    "`amount` varchar(255) DEFAULT NULL," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`name` varchar(255) DEFAULT NULL," +
                    "`transaction` varchar(255) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `user` (" +
                    "`id` bigint(20) NOT NULL AUTO_INCREMENT," +
                    "`account_locked` bit(1) NOT NULL DEFAULT b'0'," +
                    "`active` bit(1) NOT NULL DEFAULT b'1'," +
                    "`company_id` bigint(20) DEFAULT NULL," +
                    "`diesel_nozzle` varchar(255) DEFAULT NULL," +
                    "`email` varchar(255) DEFAULT NULL," +
                    "`failed_attempt` int(11) NOT NULL DEFAULT 0," +
                    "`first_login` bit(1) NOT NULL DEFAULT b'0'," +
                    "`first_name` varchar(255) DEFAULT NULL," +
                    "`last_name` varchar(255) DEFAULT NULL," +
                    "`manager_id` bigint(20) DEFAULT NULL," +
                    "`password` varchar(255) DEFAULT NULL," +
                    "`password_changed_date` datetime DEFAULT NULL," +
                    "`petrol_nozzle` varchar(255) DEFAULT NULL," +
                    "`phone_number` varchar(255) DEFAULT NULL," +
                    "`powe_diesel_nozzle` varchar(255) DEFAULT NULL," +
                    "`pump_id` bigint(20) DEFAULT NULL," +
                    "`role` varchar(100) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "`username` varchar(150) DEFAULT NULL," +
                    "`xp_petrol_nozzle` varchar(255) DEFAULT NULL," +
                    "`database_name` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)," +
                    "UNIQUE KEY `uk_user_username` (`username`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `user_master` (" +
                    "`id` bigint(20) NOT NULL AUTO_INCREMENT," +
                    "`pump_id` int(11) DEFAULT NULL," +
                    "`user_id` int(11) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `xpdailystock` (" +
                    "`id` int(11) NOT NULL AUTO_INCREMENT," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "`xp_ugadto_stock` double DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `xppetrol` (" +
                    "`id` int(11) NOT NULL," +
                    "`close_meter` varchar(255) DEFAULT NULL," +
                    "`closed_by` varchar(255) DEFAULT NULL," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`employee_name` varchar(255) DEFAULT NULL," +
                    "`open_meter` varchar(255) DEFAULT NULL," +
                    "`pump` varchar(255) DEFAULT NULL," +
                    "`rate` varchar(255) DEFAULT NULL," +
                    "`shift` varchar(255) DEFAULT NULL," +
                    "`shift_close_time` varchar(255) DEFAULT NULL," +
                    "`shift_status` varchar(255) DEFAULT NULL," +
                    "`testing` varchar(255) DEFAULT NULL," +
                    "`total` varchar(255) DEFAULT NULL," +
                    "`total_sell` varchar(255) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "`xppetrol_ltr` varchar(255) DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

            "CREATE TABLE IF NOT EXISTS `xppetrolgatt` (" +
                    "`id` int(11) NOT NULL AUTO_INCREMENT," +
                    "`date` varchar(255) DEFAULT NULL," +
                    "`user_id` varchar(255) DEFAULT NULL," +
                    "`xppetrolgatt` double DEFAULT NULL," +
                    "PRIMARY KEY (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    );

    /**
     * Complete index creation statements for performance and constraints.
     */
    private static final List<String> PUMP_SCHEMA_INDEXES = Arrays.asList(
            "CREATE INDEX idx_daily_report_created_by ON daily_reports (created_by)",
            "CREATE INDEX idx_daily_report_pump_id ON daily_reports (pump_id)",
            "CREATE INDEX idx_daily_report_employee_id ON daily_reports (employee_id)",
            "CREATE INDEX idx_daily_report_manager_id ON daily_reports (manager_id)",
            "CREATE INDEX idx_daily_report_employee_date ON daily_reports (employee_id, report_date)",
            "CREATE INDEX idx_daily_report_pump_date ON daily_reports (pump_id, report_date)",
            "CREATE INDEX idx_purchase_pump_date ON purchase (pump_id, `date`(50))",
            "CREATE INDEX idx_purchase_user_date ON purchase (user_id(50), `date`(50))",
            "CREATE INDEX idx_oilpurchase_pump_date ON oilpurchase (pump_id, `date`(50))",
            "CREATE INDEX idx_oilpurchase_user_date ON oilpurchase (user_id(50), `date`(50))",
            "CREATE INDEX idx_extrapurchases_pump_date ON extrapurchases (pump_id, `date`(50))",
            "CREATE INDEX idx_extrapurchases_user_date ON extrapurchases (user_id(50), `date`(50))"
    );

    /**
     * Provisions a brand new pump database and creates its complete schema.
     * Logs exact performance timings as required:
     *
     * CREATE PUMP START
     * Master User Save: X ms
     * Pump Name Validation: X ms
     * Database Name Generation: X ms
     * Database Creation: X ms
     * Schema Creation: X ms
     * Table Creation: X ms
     * Database Mapping: X ms
     * CREATE PUMP TOTAL: X ms
     */
    public String provisionPumpDatabase(String pumpName) {
        long totalStart = System.currentTimeMillis();
        log.info("CREATE PUMP START");

        // 1. Pump Name Validation
        long t1 = System.currentTimeMillis();
        if (pumpName == null || pumpName.trim().isEmpty()) {
            throw new IllegalArgumentException("Pump name cannot be empty or null");
        }
        long validationMs = System.currentTimeMillis() - t1;
        log.info("Pump Name Validation: {} ms", validationMs);

        // 2. Database Name Generation
        long t2 = System.currentTimeMillis();
        String dbName = PumpDatabaseNamingUtil.generatePumpDatabaseName(pumpName);
        long dbGenMs = System.currentTimeMillis() - t2;
        log.info("Database Name Generation: {} ms", dbGenMs);

        String serverUrl = MasterDatabaseInitializer.extractServerUrl(masterJdbcUrl);

        // 3. Database Creation (safe CREATE DATABASE IF NOT EXISTS, no drop or overwrite)
        long t3 = System.currentTimeMillis();
        try (Connection serverConn = DriverManager.getConnection(serverUrl, dbUsername, dbPassword);
             Statement stmt = serverConn.createStatement()) {

            stmt.executeUpdate("CREATE DATABASE IF NOT EXISTS `" + dbName + "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            log.info("Database '{}' verified/created.", dbName);

        } catch (Exception e) {
            log.error("Failed to create pump database '{}': {}", dbName, e.getMessage(), e);
            throw new RuntimeException("MySQL database creation failed for " + dbName + ": " + e.getMessage(), e);
        }
        long dbCreateMs = System.currentTimeMillis() - t3;
        log.info("Database Creation: {} ms", dbCreateMs);

        // 4 & 5. Schema Creation & Table Creation (Complete existing schema inside pump database)
        long t4 = System.currentTimeMillis();
        String pumpDbUrl = MasterDatabaseInitializer.buildMasterDbUrl(serverUrl, dbName);

        try (Connection dbConn = DriverManager.getConnection(pumpDbUrl, dbUsername, dbPassword);
             Statement stmt = dbConn.createStatement()) {

            // Create all 44 business and application tables
            for (String tableSql : PUMP_SCHEMA_TABLE_DDL) {
                try {
                    stmt.executeUpdate(tableSql);
                } catch (Exception ex) {
                    log.error("Error creating table in '{}': {}", dbName, ex.getMessage());
                    throw new RuntimeException("Table creation error in " + dbName + ": " + ex.getMessage(), ex);
                }
            }

            // Ensure hibernate_sequence has seed value
            try (ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM `hibernate_sequence`")) {
                if (rs.next() && rs.getInt(1) == 0) {
                    stmt.executeUpdate("INSERT INTO `hibernate_sequence` VALUES (10)");
                }
            } catch (Exception ignored) {}

            // Safe compatibility migration for legacy camelCase column names
            String[] migrations = {
                    "ALTER TABLE `dailytotal` CHANGE COLUMN `DailyTotal` `daily_total` double DEFAULT NULL",
                    "ALTER TABLE `Employee` CHANGE COLUMN `phoneNumber` `phone_number` varchar(255) DEFAULT NULL",
                    "ALTER TABLE `Employee` CHANGE COLUMN `accountNumber` `account_number` varchar(255) DEFAULT NULL",
                    "ALTER TABLE `Employee` CHANGE COLUMN `employeeId` `employee_id` varchar(255) DEFAULT NULL",
                    "ALTER TABLE `feedbackdata` CHANGE COLUMN `idFeedbackdata` `id_feedbackdata` int(11) NOT NULL AUTO_INCREMENT",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `cardCollection` `card_collection` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `cashCollection` `cash_collection` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `closedBy` `closed_by` varchar(255) DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `closedTime` `closed_time` datetime DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `createdDate` `created_date` datetime DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `creditSales` `credit_sales` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `fuelSales` `fuel_sales` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `netCollection` `net_collection` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `netSalesLtr` `net_sales_ltr` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `oilSales` `oil_sales` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `openingCash` `opening_cash` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `realClosingMeter` `real_closing_meter` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `realOpeningMeter` `real_opening_meter` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `reopenReason` `reopen_reason` varchar(1000) DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `reopenedBy` `reopened_by` varchar(255) DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `reopenedTime` `reopened_time` datetime DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `totalSales` `total_sales` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `totalTesting` `total_testing` double DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `updatedDate` `updated_date` datetime DEFAULT NULL",
                    "ALTER TABLE `day_closing` CHANGE COLUMN `upiCollection` `upi_collection` double DEFAULT NULL",
                    "ALTER TABLE `day_closing_audit_log` CHANGE COLUMN `ipAddress` `ip_address` varchar(255) DEFAULT NULL",
                    "ALTER TABLE `day_closing_audit_log` CHANGE COLUMN `netCollection` `net_collection` double DEFAULT NULL",
                    "ALTER TABLE `day_closing_audit_log` CHANGE COLUMN `performedBy` `performed_by` varchar(255) DEFAULT NULL",
                    "ALTER TABLE `day_closing_audit_log` CHANGE COLUMN `performedRole` `performed_role` varchar(255) DEFAULT NULL",
                    "ALTER TABLE `day_closing_audit_log` CHANGE COLUMN `totalExpenses` `total_expenses` double DEFAULT NULL",
                    "ALTER TABLE `day_closing_audit_log` CHANGE COLUMN `totalSales` `total_sales` double DEFAULT NULL"
            };
            for (String mig : migrations) {
                try {
                    stmt.executeUpdate(mig);
                } catch (Exception ignored) {}
            }

            // Create indexes safely (ignoring duplicate index warnings)
            DatabaseMetaData metaData = dbConn.getMetaData();
            for (String idxSql : PUMP_SCHEMA_INDEXES) {
                try {
                    stmt.executeUpdate(idxSql);
                } catch (Exception ignored) {
                    // Index already exists, safe to ignore
                }
            }

        } catch (Exception e) {
            log.error("Failed to initialize complete schema in pump database '{}': {}", dbName, e.getMessage(), e);
            throw new RuntimeException("Pump database schema creation failed for " + dbName + ": " + e.getMessage(), e);
        }

        long schemaCreateMs = System.currentTimeMillis() - t4;
        long tableCreateMs = schemaCreateMs; // Schema & table creation performed efficiently in same pass
        log.info("Schema Creation: {} ms", schemaCreateMs);
        log.info("Table Creation: {} ms", tableCreateMs);

        // Pre-warm DataSource cache if dynamicRoutingDataSource is configured
        if (dynamicRoutingDataSource != null) {
            try {
                dynamicRoutingDataSource.getOrCreateDataSource(dbName);
            } catch (Exception e) {
                log.warn("Notice pre-warming DataSource cache for '{}': {}", dbName, e.getMessage());
            }
        }

        long totalDuration = System.currentTimeMillis() - totalStart;
        log.info("CREATE PUMP TOTAL: {} ms", totalDuration);

        return dbName;
    }
}
