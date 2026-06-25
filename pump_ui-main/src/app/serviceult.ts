// import { environment } from "environments/environment";


// const prefix = ".."
// const prefix = environment.production

//const prefix = ".."
//   const prefix = ""  // for deply in spring boot
const prefix = "api"  // for deploy on tomcat

//report
export const API_REPORT: string = `${prefix}/portal/api`;
export const API_BACKPAGE: string = `${prefix}/portal/api/bakePage`;

// Login
export const API_LOGIN: string = `${prefix}/portal/api/authenticate`;
export const API_AUTH: string = `${prefix}/portal/api/token/generate-token`;
export const API_AUTH_VALIDATE_TOKEN: string = `${prefix}/portal/api/menu/validate-token`;
export const API_AUTH_REFRESH_TOKEN: string = `${prefix}/portal/api/menu/refresh-token`;
export const API_USER_LOGOUT: string = `${prefix}/portal/api/user/logout/`;
export const API_CLOSE_SERVER: string = `${prefix}/portal/api/close-connection`;
// Add USer
export const API_SINGUP: string = `${prefix}/portal/api/register`;


// // Dashboard
export const API_DATE_TO_DATE_TOTAL: string = `${prefix}/portal/api/dateTodateTotal`;
export const API_DAILY_TOTAL: string = `${prefix}/portal/api/dailytotal`;
export const API_CURRENTMOUNTH_TOTAL: string = `${prefix}/portal/api/totalsum/currentmonth`;
export const API_CURRENTYEAR_TOTAL: string = `${prefix}/portal/api/totalsum/currentyear`;
export const API_DAILY_CHART: string = `${prefix}/portal/api/dailyChart`;
export const API_PETROL_CURRENTYEAR_DATE: string = `${prefix}/portal/api/petrol-year-total`;
export const API_DIESEL_CURRENTYEAR_DATE: string = `${prefix}/portal/api/diesel-year-total`;
export const API_XP_PETROL_CURRENTYEAR_DATE: string = `${prefix}/portal/api/XPpetrol-year-total`;
export const API_POWER_DIESEL_CURRENTYEAR_DATE: string = `${prefix}/portal/api/Powerdiesel-year-total`;
export const API_JAMABAKI_CURRENTYEAR_DATE: string = `${prefix}/portal/api/jamabaki-year-total`;
export const API_OIL_PURCHASE_CURRENTYEAR_DATE: string = `${prefix}/portal/api/oil-purchase-year-total`;

// Purchase Sell
export const API_PURCHASE_LIST: string = `${prefix}/portal/api/purchasesList`;
export const API_PURCHASE_ADD: string = `${prefix}/portal/api/addPurchase`;
export const API_PURCHASE_EDIT: string = `${prefix}/portal/api/updatePurchase`;
export const API_PURCHASE_DELETE: string = `${prefix}/portal/api/deletePurchase`;


// Oil Purchase Sell
export const API_OIL_PURCHASE_LIST: string = `${prefix}/portal/api/oilpurchasesList`;
export const API_OIL_PURCHASE_ADD: string = `${prefix}/portal/api/addoilPurchase`;
export const API_OIL_PURCHASE_EDIT: string = `${prefix}/portal/api/updateoilPurchase`;
export const API_OIL_PURCHASE_DELETE: string = `${prefix}/portal/api/deleteoilPurchase`;

// Extra Purchase Sell
export const API_EXTRA_PURCHASE_LIST: string = `${prefix}/portal/api/extraPurchasesList`;
export const API_EXTRA_PURCHASE_ADD: string = `${prefix}/portal/api/extraAddPurchase`;
export const API_EXTRA_PURCHASE_EDIT: string = `${prefix}/portal/api/extraUpdatePurchase`;
export const API_EXTRA_PURCHASE_DELETE: string = `${prefix}/portal/api/extraDeletePurchase`;

// Petrol Sell
export const API_PETROL_LIST: string = `${prefix}/portal/api/petrolSellList`;
export const API_PETROL_ADD: string = `${prefix}/portal/api/addPetrolsell`;
export const API_PETROL_EDIT: string = `${prefix}/portal/api/updatePetrolsell`;
export const API_PETROL_DELETE: string = `${prefix}/portal/api/deletePetrol`;

// XP_Petrol 
export const API_XP_PETROL_LIST: string = `${prefix}/portal/api/XPPetrolsellList`;
export const API_XP_PETROL_ADD: string = `${prefix}/portal/api/addXPPetrolsell`;
export const API_XP_PETROL_EDIT: string = `${prefix}/portal/api/updateXpPetrolsell`;
export const API_XP_PETROL_DELETE: string = `${prefix}/portal/api/deletexpPetrol`;

// Diesel Sell
export const API_DIESEL_LIST: string = `${prefix}/portal/api/dieselSellList`;
export const API_DIESEL_ADD: string = `${prefix}/portal/api/addDieselSell`;
export const API_DIESEL_EDIT: string = `${prefix}/portal/api/updateDieselsell`;
export const API_DIESEL_DELETE: string = `${prefix}/portal/api/deleteDiesel`;


// Power Diesel 
export const API_POWER_DIESEL_LIST: string = `${prefix}/portal/api/powerDieselList`;
export const API_POWER_DIESEL_ADD: string = `${prefix}/portal/api/addpowerDiesel`;
export const API_POWER_DIESEL_EDIT: string = `${prefix}/portal/api/updatepowerDiesel`;
export const API_POWER_DIESEL_DELETE: string = `${prefix}/portal/api/deletepowerDiesel`;

// Oil Sell
export const API_OILSELL_LIST: string = `${prefix}/portal/api/oilSellList`;
export const API_OILSELL_ADD: string = `${prefix}/portal/api/addOilsell`;
export const API_OILSELL_DELETE: string = `${prefix}/portal/api/deleteOilSell`;
export const API_OILSELL_LIST_REPORT: string = `${prefix}/portal/api/oillist`;
export const API_OILTYPE_ADD: string = `${prefix}/portal/api/addoilType`;

// Petrol/Diesel Dip 
export const API_PD_DIP_LIST: string = `${prefix}/portal/api/dipPDStockList`;
export const API_PD_DIP_MAIN_TABLE_LIST: string = `${prefix}/portal/api/dipvalueMainTable`;
export const API_PD_DIP_ADD: string = `${prefix}/portal/api/addPDDipsell`;
export const API_PD_DIP_EDIT: string = `${prefix}/portal/api/editPDDipsell`;
export const API_PD_DIP_DELETE: string = `${prefix}/portal/api/deleteDip`;
export const API_PD_DIP_LIST_POINT: string = `${prefix}/portal/api/practicedip`;

// Extra Petrol/Diesel Dip 
export const API_EXTRA_PD_DIP_LIST: string = `${prefix}/portal/api/extradipPDStockList`;
export const API_EXTRA_PD_DIP_MAIN_TABLE_LIST: string = `${prefix}/portal/api/extradipvalueMainTable`;
export const API_EXTRA_PD_DIP_ADD: string = `${prefix}/portal/api/addextraPDDipsell`;
export const API_EXTRA_PD_DIP_EDIT: string = `${prefix}/portal/api/editExtraPDDipsell`;
export const API_EXTRA_PD_DIP_DELETE: string = `${prefix}/portal/api/deleteExtraDip`;
export const API_EXTRA_PD_DIP_LIST_POINT: string = `${prefix}/portal/api/extradip`;

// Kharch Sell
export const API_KHARCH_LIST: string = `${prefix}/portal/api/kharchSellList`;
export const API_KHARCH_ADD: string = `${prefix}/portal/api/addkharch`;
export const API_KHARCH_DELETE: string = `${prefix}/portal/api/deleteKharch`;
export const API_EXPENSES_LIST: string = `${prefix}/portal/api/expenseslist`;
export const API_EXPENSES_ADD: string = `${prefix}/portal/api/addexpenses`;

//Atm Sell
export const API_ATMSELL_LIST: string = `${prefix}/portal/api/atmSellList`;
export const API_ATMSELL_ADD: string = `${prefix}/portal/api/addAtmSell`;
export const API_ATMSELL_DELETE: string = `${prefix}/portal/api/deleteAtm`;


//Jama&Baki Sell
export const API_JAMABAKI_LIST: string = `${prefix}/portal/api/jamaBakiList`;
export const API_JAMABAKI_ADD: string = `${prefix}/portal/api/addJamabakiSell`;
export const API_JAMABAKI_EDIT: string = `${prefix}/portal/api/updateJamaBakiSell`;
export const API_JAMABAKI_DELETE: string = `${prefix}/portal/api/deleteJamaBaki`;



// Daily Report 
export const API_REPORT_BACK_PAGE: string = `${prefix}/portal/api/`;
export const API_PDFDATA_SHOW: string = `${prefix}/portal/api/pdfDataReport`;
export const API_EMPLOYEE_DETAILS_ADD: string = `${prefix}/portal/api/addEmployees`;
export const API_EMPLOYEE_DETAILS_LIST: string = `${prefix}/portal/api/employeesDataList`;
export const API_EMPLOYEE_IMAGES_ADD: string = `${prefix}/portal/api/addImages`;
export const API_UPLOAD: string = `${prefix}/portal/api/upload`;
export const API_EMPLOYEE_DATA: string = `${prefix}/portal/api/employeExpenses-And-Notes`;
export const API_CUSTOMER_NAME: string = `${prefix}/portal/api/customerName`;
// export const API_FIND_SENDER_RECEVIER: string = `${prefix}/portal/api/findersenderrecevier`;
export const API_JAMA_BAKI_BY_NAME: string = `${prefix}/portal/api/JamaBakiShow`;
export const API_AGGREGATED_DATA: string = `${prefix}/portal/api/aggregated-data-alldata`;

// feedBack
export const API_FEEDBACK_ADD: string = `${prefix}/portal/api/addFeedback`;

//Customer
export const API_CUSTOMER_UPDATE: string = `${prefix}/portal/api/updateCustomer`;
export const API_CUSTOMER_ADD: string = `${prefix}/portal/api/addCustomer`;
export const API_CUSTOMER_DELETE: string = `${prefix}/portal/api/customer`;

//User
export const API_USER_LIST: string = `${prefix}/portal/api/userList`;
//UserMaster Sell
export const API_USERMASTER_ADD: string = `${prefix}/portal/api/addUserMaster`;
export const API_USERMASTER_UPDATE: string = `${prefix}/portal/api/updateUserMaster`;
export const API_USER_DELETE: string = `${prefix}/portal/api/deleteUser`;


//Main
export const API_UGADTO_STOCK: string = `${prefix}/portal/api/oneDayAgoUgadtoStock`;
export const API_PETROL_STOCK: string = `${prefix}/portal/api/petrolStock`;
export const API_DIESEL_STOCK: string = `${prefix}/portal/api/dieselStock`;

export const API_XP_PETROL_STOCK: string = `${prefix}/portal/api/XppetrolStock`;
export const API_POWER_DIESEL_STOCK: string = `${prefix}/portal/api/PowerdieselStock`;
export const API_CREDIT_LOCL: string = `${prefix}/portal/api/loclDetails`;

export const API_OIL: string = `${prefix}/portal/api/OilList`;
export const API_TRANSACTION: string = `${prefix}/portal/api/transaction`;
export const API_KHARCH: string = `${prefix}/portal/api/kharch`;
export const API_JAMA_BAKI: string = `${prefix}/portal/api/jamabaki`;
export const API_PURCHASE: string = `${prefix}/portal/api/purchase`;
export const API_OIL_PURCHASE: string = `${prefix}/portal/api/oilPurchase`;
export const API_EXTRA_PURCHASE: string = `${prefix}/portal/api/extraPurchase`;
export const API_DIP: string = `${prefix}/portal/api/dip`;
export const API_EXTRA_DIP: string = `${prefix}/portal/api/extraDip`;
export const API_SAVE_FUEL_REPORT: string = `${prefix}/portal/api/saveFuelReport`;
export const API_Petrol: string = `${prefix}/portal/api/petrolList`;
export const API_DIESEL: string = `${prefix}/portal/api/dieselList`;
export const API_USER_NAME_NOZZLE: string = `${prefix}/portal/api/userNameAndNozzle`;
export const API_TOTAL_PERTOL_STOCK: string = `${prefix}/portal/api/totalPetrolStock`;
export const API_TOTAL_DIESEL_STOCK: string = `${prefix}/portal/api/totalDieselStock`;
export const API_TOTAL_XP_PERTOL_STOCK: string = `${prefix}/portal/api/totalXPPetrolStock`;
export const API_TOTAL_POWER_DIESEL_STOCK: string = `${prefix}/portal/api/totalPowerDieselStock`;
export const API_TOTAL_CASE: string = `${prefix}/portal/api/totalCase`;
export const API_MONEY_DETAILS: string = `${prefix}/portal/api/moneyDetails`;
export const API_MONEY_LIST: string = `${prefix}/portal/api/moneyDetailsList`;
export const API_EXPENSE_EXCEL: string = `${prefix}/portal/api/expensesExcel`;

export const API_XP_Petrol: string = `${prefix}/portal/api/XPpetrolList`;
export const API_POWER_DIESEL: string = `${prefix}/portal/api/powerDiesel`;

export const API_XP_POWER_SAVE: string = `${prefix}/portal/api/saveXPPowerReport`;
export const API_USER_PUMP: string = `${prefix}/portal/api/userPump`;
export const API_PETROL_STOCK_ADDEDIT = `${prefix}/portal/api/petrolStockAddEdit`;
export const API_DIESEL_STOCK_ADDEDIT = `${prefix}/portal/api/dieselStockAddEdit`;

export const API_XP_PETROL_STOCK_ADDEDIT = `${prefix}/portal/api/XPpetrolStockAddEdit`;
export const API_POWER_DIESEL_STOCK_ADDEDIT = `${prefix}/portal/api/PowerdieselStockAddEdit`;

export const API_GATT: string = `${prefix}/portal/api/gattList`;
export const API_GATT_ADDEDIT = `${prefix}/portal/api/gattAddEdit`;

export const API_DIESEL_GATT: string = `${prefix}/portal/api/dieselgattList`;
export const API_DIESEL_GATT_ADDEDIT = `${prefix}/portal/api/dieselgattAddEdit`;

export const API_XP_PETROL_GATT: string = `${prefix}/portal/api/XpPetrolgattList`;
export const API_XP_PETROL_GATT_ADDEDIT = `${prefix}/portal/api/XpPetrolgattAddEdit`;

export const API_POWER_DIESEL_GATT: string = `${prefix}/portal/api/powerDieselgattList`;
export const API_POWER_DIESEL_GATT_ADDEDIT = `${prefix}/portal/api/powerDieselgattAddEdit`;

export const API_PROFIT_LOSS_PDF = `${prefix}/portal/api/generatePdf`;
export const API_EXTRA_PROFIT_LOSS_PDF = `${prefix}/portal/api/extrageneratePdf`;

export const API_CHANGE_PASSWORD: string = `${prefix}/portal/api/changePassword`;

export const API_SEND_SMS: string = `${prefix}/sms/send`;
export const API_SEND_WHATSAPP: string = `${prefix}/sms/whatsapp`;

export const API_DATERANGE_BAKI_DETAILS: string = `${prefix}/portal/api/DateRangeExcludeZeroBaki`;

export const API_LOCL_DETAILS_ADDEDIT = `${prefix}/portal/api/loclDetailsAddEdit`;
export const API_ALL_LOCL_DETAILS_LIST = `${prefix}/portal/api/AllloclDetails`;

export const API_LOCL_DETAILS_DELETE: string = `${prefix}/portal/api/deleteloclDetails`;
export const API_CREDITTYPE_ADD: string = `${prefix}/portal/api/addcreditType`;
export const API_CREDITTYPE_LIST: string = `${prefix}/portal/api/creditlist`;

export const API_TOTAL_BAKI_DETAILS: string = `${prefix}/portal/api/totalBakiDetails`;
export const API_TOTAL_LOCL_DETAILS: string = `${prefix}/portal/api/totalloclCreditDetails`;

// // Report
// export const API_REPORT: string = `${prefix}/portal/api/generate`;
//

// // Purchase
// export const API_PURCAHSEDATA: string = `${prefix}/portal/api/purchases`;
// export const API_PURCAHSEDATA_UPDATE: string = `${prefix}/portal/api/updatePurchase`;
// export const API_PURCAHSEDATA_ADD: string = `${prefix}/portal/api/purchases`;
// export const API_PURCHASEDATA_DELETE: string = `${prefix}/portal/api/delete`;

// // Petrol
// export const API_PETROLSELL: string = `${prefix}/portal/api/PetrolSell`;
// export const API_API_PETROLSELL_UPDATE: string = `${prefix}/portal/api/Updatepetrolsell`;
// export const API_API_PETROLSELL_ADD: string = `${prefix}/portal/api/petrolsell`;
// export const API_PETROLSELL_DELETE: string = `${prefix}/portal/api/petrol`;


// // Diesel
// export const API_DIESELSELL: string = `${prefix}/portal/api/DieselSell`;

// export const API_DIESELSELL_ADD: string = `${prefix}/portal/api/dieselsell`;
// export const API_DIESELSELL_UPDATE: string = `${prefix}/portal/api/Updatedieselsell`;
// export const API_API_DIESELSELL_ADD: string = `${prefix}/portal/api/petrolsell`;
// export const API_DIESELSELL_DELETE: string = `${prefix}/portal/api/diesel`;



// // Kharch
// export const API_KHARCHDATA_DELETE: string = `${prefix}/portal/api/kharch`;

// // DipStock
// export const API_DIPSTOCK: string = `${prefix}/portal/api/Dipstock`;
// export const API_DIPSTOCK_DELETE: string = `${prefix}/portal/api/dip`;
// export const API_DIPSTOCK_UPDATE: string = `${prefix}/portal/api/dipsell`;

//
// export const API_DIP_VALUE: string = `${prefix}/portal/api/dipvalue`;
// export const API_EMPLOYEES: string = `${prefix}/portal/api/employees`;

// // OilSell
// export const API_OILSELL: string = `${prefix}/portal/api/OilSell`;
// // export const API_OILSELL_DELETE: string = `${prefix}/portal/api/oil`;
// export const API_OILSELL_UPDATE: string = `${prefix}/portal/api/oilsell`;
// export const API_EXPENSES_NOTES: string = `${prefix}/portal/api/expenses-and-notes`;

// // Images
//

// // Atm
// export const API_TRANSACTION: string = `${prefix}/portal/api/transaction`;
// export const API_ATMDATA_DELETE: string = `${prefix}/portal/api/transaction`;


// // feedback
// export const API_FEEDBACK: string = `${prefix}/portal/api/feedback`;

// // Login
// export const API_LOGIN: string = `${prefix}/portal/api/authenticate`;


//

// // Customer
// export const API_CUSTOMER_UPDATE: string = `${prefix}/portal/api/updateCustomer`;

// export const API_CUSTOMER: string = `${prefix}/portal/api/customer`;
// export const API_CUSTOMER_ALL: string = `${prefix}/portal/api/customerall`;


// // findersenderrecevier
//

// // Employee
//
//

// // JAMABAKI
// export const API_JAMA_BAKI_DELETE: string = `${prefix}/portal/api/jamaBaki`;
// export const API_JAMA_BAKI_UPDATE: string = `${prefix}/portal/api/updateJamaBaki`;
//




// // export const API_KHARCH_LIST: string = `${prefix}/portal/api/kharch`;
// export const API_JAMABAKI: string = `${prefix}/portal/api/jamabaki`;
// export const API_UPLOAD: string = `${prefix}/portal/api/upload`;
//
// export const API_TRANSATION_DATA: string = `${prefix}/portal/api/transactiondata`;

export const API_DAILY_REPORT_SUBMIT: string = `${prefix}/portal/api/dailyReport`;
export const API_GET_EMPLOYEE_REPORTS: string = `${prefix}/portal/api/dailyReport/employee`;
export const API_GET_MANAGER_REPORTS: string = `${prefix}/portal/api/dailyReport/manager`;
export const API_MANAGER_DAILY_REPORTS: string = `${prefix}/portal/api/manager/daily-report`;
export const API_UPDATE_DAILY_REPORT: string = `${prefix}/portal/api/dailyReport`;

export const API_FORGOT_PASSWORD_DIRECT: string = `${prefix}/portal/api/forgotPassword/resetDirect`;

