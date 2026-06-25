/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 *
 * @author Dell
 */
@Configuration
@EnableWebSecurity
public class SpringSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private CustomJwtAuthenticationFilter customJwtAuthenticationFilter;

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private PumpPasswordEncoder pumpPasswordEncoder;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return pumpPasswordEncoder;
    }


    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .authorizeRequests()
                .antMatchers("/api/authenticate", /* ... other URLs ... */ "/**")
                .permitAll()
                .anyRequest().authenticated()
                .and()
                .exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.addFilterBefore(customJwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    }

//    @Override
//    public void configure(HttpSecurity http) throws Exception {
//        http.csrf().disable()
//                .authorizeRequests()
//                .antMatchers("/portal/api/authenticate",
//                        "/portal/api/purchasesList",
//                        "/portal/api/addPurchase",
//                        "/portal/api/updatePurchase",
//                        "/portal/api/deletePurchase/{id}",
//                        "/portal/api/petrolSellList",
//                        "/portal/api/addPetrolsell",
//                        "/portal/api/deletePetrol/{id}",
//                        "/portal/api/updatePetrolsell",
//                        "/portal/api/dieselSellList",
//                        "/portal/api/addDieselSell",
//                        "/portal/api/deleteDiesel/{id}",
//                        "/portal/api/oilSellList",
//                        "/portal/api/addOilsell",
//                        "/portal/api/deleteOilSell/{id}",
//                        "/portal/api/dipPDStockList",
//                        "/portal/api/dipvalueMainTable",
//                        "/portal/api/addPDDipsell",
//                        "/portal/api/deleteDip/{id}",
//                        "/portal/api/kharchSellList",
//                        "/portal/api/addkharch",
//                        "/portal/api/deleteKharch/{id}",
//                        "/portal/api/atmSellList",
//                        "/portal/api/addAtmSell",
//                        "/portal/api/deleteAtm/{id}",
//                        "/portal/api/addUserMaster",
//                        "/portal/api/jamaBakiList",
//                        "/portal/api/addJamabakiSell",
//                        "/portal/api/updateJamaBakiSell",
//                        "/portal/api/deleteJamaBaki/{id}",
//                        "/portal/api/api/bill", //Report Show,
//                        "/portal/api/bakePage",//Report Show
//                        "/portal/api/pdfDataReport",//Report Show
//                        "/portal/api/addFeedback",
//                        "/portal/api/addImages",
//                        "/portal/api/addEmployees",
//                        "/portal/api/employeesDataList",
//                        "/portal/api/customerName",
//                        "/portal/api/addImages",
//                        "/portal/api/upload",
//                        "/portal/api/JamaBakiShow",// Dashboard
//                        "/portal/api/dateTodateTotal",
//                        "/portal/api/dailytotal",
//                        "/portal/api/totalsum/currentmonth",
//                        "/portal/api/totalsum/currentyear",
//                        "/portal/api/dailyChart",
//                        "/portal/api/petrol-year-total",
//                        "/portal/api/diesel-year-total",
//                        "/portal/api/jamabaki-year-total",
//                        "/portal/api/employeExpenses-And-Notes",//daily report
//                        "/portal/api/aggregated-data-alldata", //excel set all data
//                        "/portal/api/practicedip/{id}",
//                        "/portal/api/updateCustomer",//Edit Customer
//                        "/portal/api/addCustomer", //Add Customer
//                        "/portal/api/userList",//All User
//                        "/portal/api/close-connection",
//                        "/portal/api/oneDayAgoUgadtoStock",
//                        "/portal/api/OilList",
//                        "/portal/api/kharch",
//                        "/portal/api/jamabaki",
//                        "/portal/api/getPurchase",
//                        "/portal/api/saveFuelReport",//Main Report
//                        "/portal/api/userNameAndNozzle",
//                        "/portal/api/editPDDipsell",
//                        "/portal/api/totalPetrolStock",
//                        "/portal/api/totalDieselStock",
//                        "/portal/api/totalCase",
//                        "/portal/api/moneyDetails",
//                        "/portal/api/moneyDetailsList",
//                        "/portal/api/expenseslist",
//                        "/portal/api/addexpenses",
//                        "/portal/api/oillist",
//                        "/portal/api/expensesExcel",
//                        "/portal/api/deleteUser/{id}",
//                        "/portal/api/updateUserMaster/{id}",
//                        "/portal/api/addXPPetrolsell",
//                        "/portal/api/updateXpPetrolsell",
//                        "/portal/api/deletexpPetrol/{id}",
//                        "/portal/api/XPPetrolsellList",
//                        "/portal/api/powerDieselList",
//                        "/portal/api/addpowerDiesel",
//                        "/portal/api/deletepowerDiesel/{id}",
//                        "/portal/api/updatepowerDiesel",
//                        "/portal/api/XPpetrolList",
//                        "/portal/api/powerDiesel",
//                        "/portal/api/saveXPPowerReport",
//                        "/portal/api/userPump",
//                        "/portal/api/extradipPDStockList",
//                        "/portal/api/extradipvalueMainTable",
//                        "/portal/api/addextraPDDipsell",
//                        "/portal/api/editExtraPDDipsell",
//                        "/portal/api/deleteExtraDip/{id}",
//                        "/portal/api/extradip/{id}",
//                        "/portal/api/extraPurchasesList",
//                        "/portal/api/extraAddPurchase",
//                        "/portal/api/extraUpdatePurchase",
//                        "/portal/api/extraDeletePurchase/{id}",
//                        "/portal/api/extraPurchase",
//                        "/portal/api/extraDip",
//                        "/portal/api/petrolStock",
//                        "/portal/api/dieselStock",
//                        "/portal/api/dieselStockAddEdit",
//                        "/portal/api/XppetrolStock",
//                        "/portal/api/PowerdieselStock",
//                        "/portal/api/XPpetrolStockAddEdit",
//                        "/portal/api/PowerdieselStockAddEdit",
//                        "/portal/api/gattList",
//                        "/portal/api/gattAddEdit",
//                        "/portal/api/dieselgattList",
//                        "/portal/api/dieselgattAddEdit",
//                        "/portal/api/XpPetrolgattList",
//                        "/portal/api/XpPetrolgattAddEdit",
//                        "/portal/api/powerDieselgattList",
//                        "/portal/api/powerDieselgattAddEdit",
//                        "/portal/api/XPpetrol-year-total",
//                        "/portal/api/powerdiesel-year-total",
//                        "/portal/api/generatePdf/{userId}/{startDate}/{endDate}",
//                        "/portal/api/addoilType",
//                        "/portal/api/totalXPPetrolStock",
//                        "/portal/api/totalPowerDieselStock",
//                        "/portal/api/changePassword",
//                        "/portal/**"
//                )
//                .permitAll().anyRequest().authenticated()
//                .and().exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint).
//                and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).
//                and().addFilterBefore(customJwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
//    }

}
