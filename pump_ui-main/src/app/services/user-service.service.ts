import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { customer } from "app/modules/jama-baki/jama-baki-report/customer";
import { DailyTotal } from "app/models/DailyTotal";
import { DieselSellDetails } from "app/models/DieselSellDetails";
import { DipStock } from "app/models/DipStock";
import { OilSellDetails } from "app/models/OilSellDetails";
import { PetrolSellDetails } from "app/models/PetrolSellDetails";
import { UserDTO } from "app/models/UserDTO";
import {
  API_LOGIN,
  API_USERMASTER_ADD,
  API_PURCHASE_ADD,
  API_PURCHASE_EDIT,
  API_PURCHASE_DELETE,
  API_PETROL_ADD,
  API_PETROL_DELETE,
  API_PETROL_EDIT,
  API_DIESEL_ADD,
  API_DIESEL_DELETE,
  API_DIESEL_EDIT,
  API_OILSELL_ADD,
  API_OILSELL_DELETE,
  API_PD_DIP_DELETE,
  API_PD_DIP_EDIT,
  API_PD_DIP_ADD,
  API_KHARCH_DELETE,
  API_ATMSELL_DELETE,
  API_JAMABAKI_DELETE,
  API_JAMABAKI_EDIT,
  API_UPLOAD,
  API_FEEDBACK_ADD,
  API_DATE_TO_DATE_TOTAL,
  API_PDFDATA_SHOW,
  API_EMPLOYEE_DATA,
  API_CUSTOMER_UPDATE,
  API_JAMA_BAKI_BY_NAME,
  API_CLOSE_SERVER,
  API_UGADTO_STOCK,
  API_OIL,
  API_TRANSACTION,
  API_KHARCH,
  API_JAMA_BAKI,
  API_PURCHASE,
  API_DIP,
  API_SAVE_FUEL_REPORT,
  API_DAILY_REPORT_SUBMIT,
  API_GET_EMPLOYEE_REPORTS,
  API_GET_MANAGER_REPORTS,
  API_MANAGER_DAILY_REPORTS,
  API_UPDATE_DAILY_REPORT,
  API_DIESEL_LIST,
  API_DIESEL,
  API_Petrol,
  API_TOTAL_PERTOL_STOCK,
  API_TOTAL_DIESEL_STOCK,
  API_TOTAL_CASE,
  API_MONEY_DETAILS,
  API_MONEY_LIST,
  API_EXPENSES_LIST,
  API_EXPENSES_ADD,
  API_OILSELL_LIST_REPORT,
  API_EXPENSE_EXCEL,
  API_USER_DELETE,
  API_USERMASTER_UPDATE,
  API_XP_PETROL_DELETE,
  API_XP_PETROL_EDIT,
  API_POWER_DIESEL_DELETE,
  API_POWER_DIESEL_EDIT,
  API_XP_Petrol,
  API_POWER_DIESEL,
  API_XP_POWER_SAVE,
  API_USER_PUMP,
  API_EXTRA_PD_DIP_DELETE,
  API_EXTRA_PD_DIP_ADD,
  API_EXTRA_PD_DIP_EDIT,
  API_EXTRA_PURCHASE_DELETE,
  API_EXTRA_PURCHASE_EDIT,
  API_EXTRA_PURCHASE,
  API_EXTRA_DIP,
  API_USER_NAME_NOZZLE,
  API_PETROL_STOCK_ADDEDIT,
  API_PETROL_STOCK,
  API_DIESEL_STOCK,
  API_DIESEL_STOCK_ADDEDIT,
  API_XP_PETROL_STOCK,
  API_POWER_DIESEL_STOCK,
  API_XP_PETROL_STOCK_ADDEDIT,
  API_POWER_DIESEL_STOCK_ADDEDIT,
  API_GATT,
  API_GATT_ADDEDIT,
  API_DIESEL_GATT,
  API_DIESEL_GATT_ADDEDIT,
  API_XP_PETROL_GATT,
  API_XP_PETROL_GATT_ADDEDIT,
  API_POWER_DIESEL_GATT,
  API_POWER_DIESEL_GATT_ADDEDIT,
  API_PROFIT_LOSS_PDF,
  API_OILTYPE_ADD,
  API_TOTAL_XP_PERTOL_STOCK,
  API_TOTAL_POWER_DIESEL_STOCK,
  API_EXTRA_PROFIT_LOSS_PDF,
  API_CUSTOMER_DELETE,
  API_CHANGE_PASSWORD,
  API_DATERANGE_BAKI_DETAILS,
  API_CREDIT_LOCL,
  API_LOCL_DETAILS_ADDEDIT,
  API_ALL_LOCL_DETAILS_LIST,
  API_CREDITTYPE_ADD,
  API_CREDITTYPE_LIST,
  API_TOTAL_BAKI_DETAILS,
  API_TOTAL_LOCL_DETAILS,
  API_OIL_PURCHASE,
  API_OIL_PURCHASE_EDIT,
  API_OIL_PURCHASE_DELETE,
  API_EMPLOYEE_IMAGES_ADD,
  API_REPORT,
  API_FORGOT_PASSWORD_DIRECT,
} from "app/serviceult";
import { BehaviorSubject, Observable } from "rxjs";
import { PurchaseDetails } from "app/models/PurchaseDetails ";
import { XpPetrol } from "app/models/XpPetrol";
import { extraDipStock } from "app/models/extraDipStock";
import { ExtraPurchaseDetails } from "app/models/ExtraPurchaseDetails";

@Injectable({
  providedIn: "root",
})
export class UserServiceService {
  reportDate: any;

  constructor(private http: HttpClient) { }

  private userId: string | null = null;

  setUserId(id: string) {
    this.userId = id;
  }

  getUserId(): string | null {
    return this.userId;
  }

  loginIN(username: string, password: string) {
    // const headers: any = { "Bypass-Tunnel-Reminder": true };
    const headers = new HttpHeaders({ "Bypass-Tunnel-Reminder": "true" });
    return this.http.post<any>(API_LOGIN, { username, password }, { headers });
  }

  isLoggedIn(): boolean {
    "token>>>>>>" + localStorage.getItem("token");
    !!localStorage.getItem("token");
    return !!localStorage.getItem("token"); // Check if token exists
  }

  closeServer(): Observable<any> {
    return this.http.post(API_CLOSE_SERVER, {}, { responseType: 'text' });
  }

  // sing up pAGE
  signUp(user: UserDTO): Observable<any> {
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // return this.http.post(API_USERMASTER_ADD, user);
    return this.http.post(API_USERMASTER_ADD, user);
  }

  updateUser(userData: any): Observable<any> {
    return this.http.put(`${API_USERMASTER_UPDATE}/${userData.id}`, userData);
  }





  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${API_USER_DELETE}/${id}`);
  }

  // Purchase Sell
  addPurchase(data: PurchaseDetails) {
    data;
    return this.http.post(API_PURCHASE_ADD, data);
  }

  getUpdatePurchase(data: PurchaseDetails): Observable<string> {
    return this.http.post(API_PURCHASE_EDIT, data, {
      responseType: "text", // ✅ No need to cast to 'json'
    });
  }

  getUpdateOilPurchase(data: PurchaseDetails): Observable<string> {
    return this.http.post(API_OIL_PURCHASE_EDIT, data, {
      responseType: "text", // ✅ No need to cast to 'json'
    });
  }

  getUpdateExtraPurchase(data: ExtraPurchaseDetails): Observable<string> {
    return this.http.post(API_EXTRA_PURCHASE_EDIT, data, {
      responseType: "text", // ✅ No need to cast to 'json'
    });
  }

  deletePurchasedata(id: string): Observable<any> {
    return this.http.delete(`${API_PURCHASE_DELETE}/${id}`);
  }

  deleteOilPurchasedata(id: string): Observable<any> {
    return this.http.delete(`${API_OIL_PURCHASE_DELETE}/${id}`);
  }

  deleteExtraPurchasedata(id: string): Observable<any> {
    return this.http.delete(`${API_EXTRA_PURCHASE_DELETE}/${id}`);
  }

  // Petrol Sell
  addPetrolSell(data: PetrolSellDetails) {
    return this.http.post(API_PETROL_ADD, data);
  }

  deletePetroldata(id: string): Observable<any> {
    return this.http.delete(`${API_PETROL_DELETE}/${id}`);
  }

  getUpdatePetrol(data: PetrolSellDetails): Observable<any> {
    return this.http.post(API_PETROL_EDIT, data);
  }

  // Diesel Sell
  addDiesellSell(data: DieselSellDetails) {
    return this.http.post(API_DIESEL_ADD, data);
  }

  deleteDieseldata(id: string): Observable<any> {
    return this.http.delete(`${API_DIESEL_DELETE}/${id}`);
  }
  getUpdateDiesel(data: DieselSellDetails): Observable<any> {
    return this.http.post(API_DIESEL_EDIT, data);
  }

  // Oil Sell

  addOilSell(data: OilSellDetails) {
    return this.http.post(API_OILSELL_ADD, data);
  }

  // editUpdateOil(data: OilSellDetails): Observable<any> {

  //   return this.http.post(API_OILSELL_UPDATE, data);
  // }

  deleteOildata(id: string): Observable<any> {
    return this.http.delete(`${API_OILSELL_DELETE}/${id}`);
  }

  // Petrol/Diesel Dip
  deletedipdata(id: string): Observable<any> {
    return this.http.delete(`${API_PD_DIP_DELETE}/${id}`);
  }

  // Extra Petrol/Diesel Dip
  deleteExtradipdata(id: string): Observable<any> {
    return this.http.delete(`${API_EXTRA_PD_DIP_DELETE}/${id}`);
  }

  getUpdateDip(data: DipStock): Observable<any> {
    // const url = `http://localhost:8081/dipsell`;

    return this.http.post(API_PD_DIP_EDIT, data);
  }

  getUpdateExtraDip(data: extraDipStock): Observable<any> {
    // const url = `http://localhost:8081/dipsell`;

    return this.http.post(API_EXTRA_PD_DIP_EDIT, data);
  }

  addDipstock(data: DipStock) {
    return this.http.post(API_PD_DIP_ADD, data);
  }

  addextraDipstock(data: extraDipStock) {
    return this.http.post(API_EXTRA_PD_DIP_ADD, data);
  }

  // Kharch Sell
  deleteKharchdata(id: string): Observable<any> {
    return this.http.delete(`${API_KHARCH_DELETE}/${id}`);
  }

  //Atm Sell
  deleteTransaction(id: string): Observable<any> {
    return this.http.delete(`${API_ATMSELL_DELETE}/${id}`);
  }

  //Jama&Baki Sell
  deletejamabakidata(id: any): Observable<any> {
    return this.http.delete(`${API_JAMABAKI_DELETE}/${id}`);
  }

  updateJamabaki(data: any): Observable<any> {
    return this.http.put(API_JAMABAKI_EDIT, data);
  }

  // Employee Details

  getImageUrls(): Observable<string[]> {
    return this.http.get<string[]>(API_EMPLOYEE_IMAGES_ADD);
  }

  // feedBack
  feedback(data: any) {
    return this.http.post(API_FEEDBACK_ADD, data);
  }

  // DASHBOARD
  getDailyTotals(startDate: string, endDate: string, userId: string): Observable<DailyTotal[]> {
    const params = new HttpParams()
      .set("startDate", startDate)
      .set("endDate", endDate)
      .set("userId", userId);

    return this.http.get<DailyTotal[]>(API_DATE_TO_DATE_TOTAL, { params });
  }

  // Daily Report
  // getTransactions(name: string): Observable<Transaction[]> {
  //   return this.http.get<Transaction[]>(`${API_FIND_SENDER_RECEVIER}?name=${name}`);
  // }

  // getAllData() {
  //   return this.http.get('http://localhost:8081/all');
  // }

  // deleteMember(id: number): Observable<any> {
  //   return this.http.delete(`http://localhost:8081/delete/${id}`);
  // }

  // updateUserData(userData: any): Observable<any> {
  //   return this.http.put('http://localhost:8081/edit', userData);
  // }

  // getUpdate(data: SingUp): Observable<any> {
  //   const url = `http://localhost:8081update`;

  //   return this.http.post(url, data);
  // }

  // checkUserData(username: string, email: string, flatenNo: string): Observable<any> {
  //   const url = `http://localhost:8081/create-user`;

  //   // Create an object with the data to send to the server
  //   const data = {
  //     username: username,
  //     email: email,
  //     flatenNo: flatenNo
  //   };

  //   // Make an HTTP POST request to your server
  //   return this.http.post<boolean>(url, data);
  // }

  // // setPayment(payment: Payment): Observable<Payment> {
  // //   return this.http.post<Payment>(`http://localhost:8081/payment`, payment);
  // // }

  // setPayment(username: string, Payment_type: number, Rupess: string, type_events: string): Observable<any> {
  //   const payload = {
  //     username: username,
  //     payment_type: Payment_type,
  //     rupess: Rupess,
  //     type_events: type_events
  //   };

  //   return this.http.post(`http://localhost:8081/payment`, payload);
  // }

  // AddVehicle(formData: any): Observable<any> {
  //   const url = `http://localhost:8081/Vehicle`;

  //   // Make an HTTP POST request to add the vehicle data
  //   return this.http.post(url, formData);
  // }

  // private apiUrl1 = 'http://localhost:8081/authenticate'; // Your Spring Boot API base URL

  // login(username: string, password: string): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl1}`, { username, password });
  // }

  // private totalRupeesSource = new BehaviorSubject<number>(0);
  // totalRupees$ = this.totalRupeesSource.asObservable();

  // updateTotalRupees(totalRupees: number): void {
  //   this.totalRupeesSource.next(totalRupees);
  // }

  // generateReport(): Observable<HttpResponse<Blob>> {
  //   return this.http.get<Blob>(API_REPORT, { observe: 'response', responseType: 'blob' as 'json' });
  // }

  getPDFData(fileName: string | number | boolean): Observable<any> {
    const param = new HttpParams().set("fileName", fileName);
    return this.http.post(API_PDFDATA_SHOW, null, {
      responseType: "arraybuffer",
      params: param,
      headers: new HttpHeaders().append("Content-Type", "application/pdf"),
    });
  }
  getExpensesAndNotes(notes: string, userId: string): Observable<any> {
    const params = { notes, userId };
    return this.http.get(API_EMPLOYEE_DATA, { params });
  }

  // Customer edit
  getUpdatecustomer(data: customer): Observable<any> {
    return this.http.post(API_CUSTOMER_UPDATE, data);
  }

  deletecustomerdata(id: string): Observable<any> {
    return this.http.delete(`${API_CUSTOMER_DELETE}/${id}`);
  }

  private selectedItemsSource = new BehaviorSubject<any[]>([]);
  selectedItems$ = this.selectedItemsSource.asObservable();

  updateSelectedItems(items: any[]) {
    this.selectedItemsSource.next(items);
  }

  // private apiUrl2 = 'http://localhost:8081/findersenderrecevier'; // Adjust the URL as needed

  getJamaBAki(
    name: string,
    startDate: string,
    endDate: string
  ): Observable<any[]> {
    const userId = localStorage.getItem("userId");
    let params = new HttpParams()
      .set("name", name)
      .set("startDate", startDate)
      .set("endDate", endDate)
      .set("userId", userId);

    return this.http.get<any[]>(API_JAMA_BAKI_BY_NAME, { params });
  }

  getFormattedDate(reportDate: any): string {
    const date = new Date(reportDate);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date input");
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }


  getPetrolStock(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_PETROL_STOCK, { params });
  }

  getDieselStock(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_DIESEL_STOCK, { params });
  }

  getXpPetrolStock(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_XP_PETROL_STOCK, { params });
  }

  getPowerDieselStock(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_POWER_DIESEL_STOCK, { params });
  }

  getcreditNOteIOCL(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_CREDIT_LOCL, { params });
  }

  getAllcreditNOteIOCL(userId: string): Observable<any> {
    const params = new HttpParams().set("userId", userId);
    return this.http.get<any>(API_ALL_LOCL_DETAILS_LIST, { params });
  }



  getOneDayAgoStock(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_UGADTO_STOCK, { params });
  }

  getOillsellList(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_OIL, { params });
  }

  getTransactionList(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_TRANSACTION, { params });
  }

  getKharchList(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_KHARCH, { params });
  }

  getJamaBakiList(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_JAMA_BAKI, { params });
  }

  getPurchaseiList(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_PURCHASE, { params });
  }

  getOilPurchaseiList(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_OIL_PURCHASE, { params });
  }

  getExtraPurchaseiList(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_EXTRA_PURCHASE, { params });
  }

  getDipList(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_DIP, { params });
  }

  getextraDipList(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_EXTRA_DIP, { params });
  }

  savefuleData(petrolData: any[], dieselData: any[]): Observable<any> {
    const payload = {
      petrolInputData: petrolData,
      dieselInputData: dieselData,
    };

    return this.http.post(API_SAVE_FUEL_REPORT, payload);
  }

  getPetrolList(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_Petrol, { params });
  }

  getDieselList(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_DIESEL, { params });
  }

  getUserNameAndNozzle(userId: string): Observable<any> {
    const params = new HttpParams().set("userId", userId);

    return this.http.get<any>(API_USER_NAME_NOZZLE, { params });
  }

  savePetrolStockData(
    userId: String,
    date: string,
    petrolRemaining: number
  ): Observable<any> {
    const payload = {
      userId: userId,
      date: date,
      petrolRemaining: petrolRemaining,
    };
    return this.http.post(API_TOTAL_PERTOL_STOCK, payload);
  }

  saveDieselStockData(
    userId: String,
    date: string,
    dieselRemaining: number
  ): Observable<any> {
    const payload = {
      userId: userId,
      date: date,
      dieselRemaining: dieselRemaining,
    };
    return this.http.post(API_TOTAL_DIESEL_STOCK, payload);
  }

  saveXPPetrolStockData(
    userId: String,
    date: string,
    xppetrolRemaining: number
  ): Observable<any> {
    const payload = {
      userId: userId,
      date: date,
      xppetrolRemaining: xppetrolRemaining,
    };
    return this.http.post(API_TOTAL_XP_PERTOL_STOCK, payload);
  }

  savePowerDieselStockData(
    userId: String,
    date: string,
    powerdieselRemaining: number
  ): Observable<any> {
    const payload = {
      userId: userId,
      date: date,
      powerdieselRemaining: powerdieselRemaining,
    };
    return this.http.post(API_TOTAL_POWER_DIESEL_STOCK, payload);
  }

  saveTotalCase(
    userId: String,
    date: string,
    totalcase: number
  ): Observable<any> {
    const payload = {
      userId: userId,
      date: date,
      totalcase: totalcase,
    };
    return this.http.post(API_TOTAL_CASE, payload);
  }

  saveMoneyDetails(payload: any): Observable<any> {
    return this.http.post<any>(API_MONEY_DETAILS, payload);
  }

  getMoneyList(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_MONEY_LIST, { params });
  }

  getexpensesList(userId: string): Observable<any> {
    const params = new HttpParams().set("userId", userId);

    return this.http.get<any>(API_EXPENSES_LIST, { params });
  }

  addExpence(payload: { expensesList: string }) {
    return this.http.post(API_EXPENSES_ADD, payload);
  }

  getoilList(userId: string): Observable<any> {
    const params = new HttpParams().set("userId", userId);

    return this.http.get<any>(API_OILSELL_LIST_REPORT, { params });
  }

  addOilType(payload: { oilSellList: string }) {
    return this.http.post(API_OILTYPE_ADD, payload);
  }

  addCreditType(payload: { creditList: string }) {
    return this.http.post(API_CREDITTYPE_ADD, payload);
  }

  getExpenses(
    expense: string,
    startDate: string,
    endDate: string
  ): Observable<any[]> {
    const userId = localStorage.getItem("userId");
    let params = new HttpParams()
      .set("expense", expense)
      .set("startDate", startDate)
      .set("endDate", endDate)
      .set("userId", userId);

    return this.http.get<any[]>(API_EXPENSE_EXCEL, { params });
  }

  deleteXPPetroldataid(id: string): Observable<any> {
    return this.http.delete(`${API_XP_PETROL_DELETE}/${id}`);
  }
  getUpdateXPPetrol(data: XpPetrol): Observable<any> {
    return this.http.post(API_XP_PETROL_EDIT, data);
  }


  deletepowerDieselid(id: string): Observable<any> {
    return this.http.delete(`${API_POWER_DIESEL_DELETE}/${id}`);
  }
  getUpdatepowerDiesel(data: XpPetrol): Observable<any> {
    return this.http.post(API_POWER_DIESEL_EDIT, data);
  }

  getXPPetrolList(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_XP_Petrol, { params });
  }

  getpowerDiesel(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_POWER_DIESEL, { params });
  }

  saveXpPowerData(XppetrolInputData: any[], powerDieselInputData: any[]): Observable<any> {
    const payload = {
      XppetrolInputData: XppetrolInputData,
      powerDieselInputData: powerDieselInputData,
    };

    return this.http.post(API_XP_POWER_SAVE, payload);
  }

  getUserPump(userId: string): Observable<any> {
    const params = new HttpParams().set("userId", userId);

    return this.http.get<any>(API_USER_PUMP, { params });
  }


  savePetrolStock(data: any): Observable<any> {
    return this.http.post(API_PETROL_STOCK_ADDEDIT, data);
  }

  savedieselStock(data: any): Observable<any> {
    return this.http.post(API_DIESEL_STOCK_ADDEDIT, data);
  }

  saveXPPetrolStock(data: any): Observable<any> {
    return this.http.post(API_XP_PETROL_STOCK_ADDEDIT, data);
  }

  savePowerdieselStock(data: any): Observable<any> {
    return this.http.post(API_POWER_DIESEL_STOCK_ADDEDIT, data);
  }

  getPetrolGatt(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_GATT, { params });
  }

  savePetrolGatt(data: any): Observable<any> {
    return this.http.post(API_GATT_ADDEDIT, data);
  }


  getDieselGatt(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_DIESEL_GATT, { params });
  }

  saveDieselGatt(data: any): Observable<any> {
    return this.http.post(API_DIESEL_GATT_ADDEDIT, data);
  }


  getXpPetrolGatt(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_XP_PETROL_GATT, { params });
  }

  saveXpPetrolGatt(data: any): Observable<any> {
    return this.http.post(API_XP_PETROL_GATT_ADDEDIT, data);
  }

  getPowerDieselGatt(date: string, userId: string): Observable<any> {
    const params = new HttpParams().set("date", date).set("userId", userId);

    return this.http.get<any>(API_POWER_DIESEL_GATT, { params });
  }

  savePowerDieselGatt(data: any): Observable<any> {
    return this.http.post(API_POWER_DIESEL_GATT_ADDEDIT, data);
  }


  downloadPdf(userId: any, startDate: any, endDate: any): Observable<Blob> {
    return this.http.get(`${API_PROFIT_LOSS_PDF}/${userId}/${startDate}/${endDate}`, {
      responseType: 'blob'
    });
  }

  extraPredownloadPdf(userId: any, startDate: any, endDate: any): Observable<Blob> {
    return this.http.get(`${API_EXTRA_PROFIT_LOSS_PDF}/${userId}/${startDate}/${endDate}`, {
      responseType: 'blob'
    });
  }

  changePassword(changePasswordData: any, userId: any): Observable<any> {
    const payload = {
      ...changePasswordData,
      userId: userId
    };
    return this.http.post<any>(API_CHANGE_PASSWORD, payload);
  }


  dialogZIndexAdjustment() {
    $(".cdk-overlay-backdrop").removeAttr('style').css("z-index", "900");
    $(".cdk-overlay-container").removeAttr('style').css("z-index", "1030");
  }

  getBakiReport(startDate: string, endDate: string, userId: string) {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('userId', userId);

    return this.http.get<any[]>(API_DATERANGE_BAKI_DETAILS, { params });
  }

  saveLOCLDetails(data: any): Observable<any> {
    return this.http.post(API_LOCL_DETAILS_ADDEDIT, data);
  }

  getcreditList(userId: string): Observable<any> {
    const params = new HttpParams().set("userId", userId);

    return this.http.get<any>(API_CREDITTYPE_LIST, { params });
  }

  getTotalBakiReport(startDate: string, endDate: string, userId: string) {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('userId', userId);

    return this.http.get<any[]>(API_TOTAL_BAKI_DETAILS, { params });
  }

  getTotalLoclReport(startDate: string, endDate: string, userId: string) {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('userId', userId);

    return this.http.get<any[]>(API_TOTAL_LOCL_DETAILS, { params });
  }

  submitDailyReport(data: any): Observable<any> {
    return this.http.post<any>(API_DAILY_REPORT_SUBMIT, data);
  }

  getEmployeeReports(employeeId: number): Observable<any> {
    return this.http.get<any>(`${API_GET_EMPLOYEE_REPORTS}/${employeeId}`);
  }

  getEmployeesByManager(managerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_REPORT}/employees/manager/${managerId}`);
  }

  getManagerReports(managerId: number): Observable<any> {
    return this.http.get<any>(`${API_GET_MANAGER_REPORTS}/${managerId}`);
  }

  getManagerDailyReports(pumpId: number, date: string, managerId?: number): Observable<any[]> {
    let params = new HttpParams();
    if (managerId) {
      params = params.set('managerId', managerId.toString());
    }
    if (pumpId) {
      params = params.set('pumpId', pumpId.toString());
    }
    params = params.set('date', date);
    return this.http.get<any[]>(API_MANAGER_DAILY_REPORTS, { params });
  }

  updateDailyReport(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${API_UPDATE_DAILY_REPORT}/${id}`, data);
  }

  resetForgotPasswordDirect(identity: string, newPassword: string): Observable<any> {
    return this.http.post<any>(API_FORGOT_PASSWORD_DIRECT, { identity, newPassword });
  }
}
