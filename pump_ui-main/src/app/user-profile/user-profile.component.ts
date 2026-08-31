import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { CustomPdfViewerComponent } from "./custom-pdf-viewer/custom-pdf-viewer.component";
import { HttpClient } from "@angular/common/http";
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from "@angular/platform-browser";
import {
  API_BACKPAGE,
  API_CUSTOMER_NAME,
  API_EMPLOYEE_DETAILS_LIST,
  API_REPORT,
} from "app/serviceult";
import { Employee } from "app/models/DailyTotal";
import { BackPageComponent } from "app/modules/back-page/back-page.component";
import { CustomerComponent } from "app/modules/jama-baki/customer/customer.component";
import { EmployeeDetailsComponent } from "app/modules/employee-details/employee-details.component";
import { EmployeeComponent } from "app/modules/employee/employee.component";
import { ItReturnComponent } from "app/modules/it-return/it-return.component";
import { MonthlyJamaBakiTotalComponent } from "app/modules/monthly-jama-baki-total/monthly-jama-baki-total.component";
import { PumpDetailComponent } from "app/modules/pump-detail/pump-detail.component";
import { LoaderService } from "app/services/loader.service";
import { UserServiceService } from "app/services/user-service.service";
import { NotificationService } from "app/services/notification.service";
import { ExpensesExcelComponent } from "./expenses-excel/expenses-excel.component";
import { BakiDetailsComponent } from "./baki-details/baki-details.component";
import { PumpTotalBakiDetailsComponent } from "./pump-total-baki-details/pump-total-baki-details.component";
import { LoclDetailsComponent } from "./locl-details/locl-details.component";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  isProcessing: boolean | undefined;
  startDate: string = "";
  endDate: string = "";
  productList: any = [];
  customers: string[] = [];
  senderAmountTotal: number = 0;
  receiverAmountTotal: number = 0;
  totalDifference: number = 0;
  dailyTotal: number;
  CurrentmonthTotal: number = 0;
  CurrentyearTotal: number = 0;
  currentPage = 1;
  itemsPerPage = 2;
  selectedCustomer: string = "";
  name: string = "";
  names: string = "";
  thumbnails: SafeUrl[] = [];
  startDateJb: string;
  endDateJb: string;
  userId: string;
  isReload: boolean;
  expensesList: string[] = []
  selectedExpense: string = '';
  xp_petrol_nozzle: number;
  powe_diesel_nozzle: number;
  startDateExpen: string;
  endDateExpen: string;
  selectedDate!: Date | null;
  selectedDateBakepage!: Date | null;
  startDatePdf: string;
  endDatePdf: string;
  startDateBaki: string;
  endDateBaki: string;
  startDateCustomerBaki: string;
  endDateCustomerBaki: string;
  startDateCredit: string;
  endDateCredit: string;
  dailyReports: any[] = [];
  totalReportsSales: number = 0;
  role: string = '';
  totalSubmissionsCount: number = 0;
  managerEmployeeList: any[] = [];
  managerEmployeeIds: number[] = [];
  isManager: boolean = false;
  employeeListLoaded: boolean = false;

  constructor(
    private use: UserServiceService,
    private http: HttpClient,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loaderService.display(false);
    this.userId = localStorage.getItem('userId');
    this.role = localStorage.getItem('role') || 'Owner';
    this.isManager = this.role === 'PUMP_MANAGER' || this.role === 'user';
    this.getdata();
    this.getUserName();
    this.getDailyReports();
    if (this.isManager) {
      this.loadManagerEmployees();
    } else {
      this.getCustomer();
      this.getexpensesList();
    }
  }

  /** Load all employees under this pump manager, then initialize dependent data */
  loadManagerEmployees() {
    const numericId = Number(this.userId);
    if (!numericId) return;
    this.use.getEmployeesByManager(numericId).subscribe({
      next: (employees: any[]) => {
        this.managerEmployeeList = employees || [];
        this.managerEmployeeIds = this.managerEmployeeList.map(e => Number(e.id || e.userId));
        this.employeeListLoaded = true;
        // Now load customer list and expenses using each employee's userId
        this.getCustomerForManager();
        this.getExpensesListForManager();
      },
      error: (err) => {
        console.error('Error loading manager employees:', err);
        this.employeeListLoaded = true;
        // Fallback: use manager's own userId
        this.getCustomer();
        this.getexpensesList();
      }
    });
  }

  /** Load customers from all employees under this manager */
  getCustomerForManager() {
    if (!this.managerEmployeeIds.length) {
      // Fallback: use manager's userId directly
      this.getCustomer();
      return;
    }
    // Use manager's userId — backend should aggregate based on hierarchy
    const url = `${API_CUSTOMER_NAME}?userId=${this.userId}&managerId=${this.userId}`;
    this.http.get(url).subscribe({
      next: (data) => {
        this.customers = Object.values(data).map((item: any) => item.name);
      },
      error: () => this.getCustomer() // fallback
    });
  }

  /** Load expenses list scoped to manager's employees */
  getExpensesListForManager() {
    this.use.getexpensesList(this.userId).subscribe((response) => {
      this.expensesList = response.map((item) => item.expensesList);
    });
  }

  EmployeeDetails() {
    const dialogRef = this.dialog.open(EmployeeComponent, {
      width: "40%",
      height: "100%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getdata();
      this.getCustomer();
    });
  }

  openDetails(items: any) {
    this.use.getExpensesAndNotes(items.name, items.userId).subscribe((data) => {
      const dialogRef = this.dialog.open(EmployeeDetailsComponent, {
        panelClass: ['dialog-modern-wrapper', 'dialog-lg'],
        data: items.name,
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.Customerall();
      });
    });
  }
  openDialog() {
    const dialogRef = this.dialog.open(CustomerComponent, {
      panelClass: ['dialog-modern-wrapper', 'dialog-md'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }
  exportToExcel() {
    if (!this.startDate || !this.endDate) {
      this.notificationService.failure(
        "Please select both start date and end date"
      );
      return;
    }

    const dialogRef = this.dialog.open(PumpDetailComponent, {
      width: "90%",
      height: "90%",
      data: {
        startDate: this.startDate,
        endDate: this.endDate,
        // Pass managerId so backend can aggregate all employee data
        managerId: this.isManager ? this.userId : null,
        employeeIds: this.isManager ? this.managerEmployeeIds : null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getdata();
      if (this.isManager) { this.getCustomerForManager(); this.getExpensesListForManager(); }
      else { this.getCustomer(); this.getexpensesList(); }
    });
  }

  fetchTransactions(): void {
    // this.use.getTransactions(this.name).subscribe((data: Transaction[]) => {
    //   this.productList = data;
    //   this.calculateTotals();
    // });
  }
  calculateTotals() {
    this.senderAmountTotal = 0;
    this.receiverAmountTotal = 0;
    this.productList.forEach(
      (transaction: { sender: string; amount: string; receiver: string }) => {
        const amount = parseFloat(transaction.amount);
        if (!isNaN(amount)) {
          if (transaction.sender === this.name) {
            this.senderAmountTotal += amount;
          }
          if (transaction.receiver === this.name) {
            this.receiverAmountTotal += amount;
          }
        }
        this.totalDifference =
          this.receiverAmountTotal - this.senderAmountTotal;
      }
    );
    "send" + this.senderAmountTotal;
    "rec" + this.receiverAmountTotal;
  }

  Customerall() {
    this.userId = localStorage.getItem("userId");
    const url = `${API_CUSTOMER_NAME}?userId=${this.userId}`;
    this.http.get<any>(url).subscribe((data: any) => {
      this.names = data.map((data: any) => data.name);
    });
  }

  getCustomer() {
    this.userId = localStorage.getItem("userId");
    const url = `${API_CUSTOMER_NAME}?userId=${this.userId}`;
    this.http.get(url).subscribe((data) => {
      this.customers = Object.values(data).map((item: any) => item.name);
    });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }
  getdata() {
    this.userId = localStorage.getItem("userId");
    const params = { userId: this.userId };
    this.http.get(API_EMPLOYEE_DETAILS_LIST, { params }).subscribe((data) => {
      this.productList = data;
      // let objectURL = 'data:image/jpeg;base64,' + data[0].photo;
      // this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.productList.forEach((product) => {
        let objectURL = "data:image/jpeg;base64," + product.photo;
        this.thumbnails.push(this.sanitizer.bypassSecurityTrustUrl(objectURL));
      });
    });
  }

  bin2string(array: any) {
    var result = "";
    for (var i = 0; i < array.length; ++i) {
      result += String.fromCharCode(array[i]);
    }
    return result;
  }

  isFile(obj: any): obj is File {
    return obj instanceof File;
  }

  isBlob(obj: any): obj is Blob {
    return obj instanceof Blob;
  }
  image: any[] = [];

  getPhotoUrl(employee: Employee): any {
    if (this.isFile(employee.photo)) {
      const reader = new FileReader();
      reader.readAsDataURL(employee.photo);
      return new Promise<string>((resolve) => {
        reader.onload = () => {
          resolve(reader.result as string);
        };
      });
    } else if (this.isBlob(employee.photo)) {
      const photoBlob = new Blob([employee.photo], { type: "image/jpeg" });
      return window.URL.createObjectURL(photoBlob);
    }
  }

  user_photo!: SafeResourceUrl;
  photo_url(data: string) {
    this.user_photo = this.sanitizer.bypassSecurityTrustResourceUrl(
      "data:image/jpeg;base64," + new Blob([data], { type: "image/jpeg" })
    );
  }
  // downloadReport(selectedDate: string): void {
  //   // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint URL
  //   const apiUrl = 'http://localhost:8081/ api/bill';

  //   // Append selected date to the API endpoint
  //   const urlWithParams = `${apiUrl}?date=${selectedDate}`;

  //   // Make a GET request to the API endpoint to download the PDF
  //   fetch(urlWithParams, {
  //     method: 'GET',
  //   })
  //     .then(response => {
  //       // Check if the response is successful
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.blob(); // Extract the binary data from the response
  //     })
  //     .then(blob => {
  //       // Create a blob URL for the downloaded PDF
  //       const url = window.URL.createObjectURL(blob);

  //       // Create a temporary anchor element to trigger the download
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = `${selectedDate}.pdf`; // Set the filename for the downloaded PDF

  //       document.body.appendChild(a);

  //       // Click the anchor element to start the download
  //       a.click();

  //       // Cleanup: revoke the blob URL and remove the anchor element
  //       window.URL.revokeObjectURL(url);
  //       document.body.removeChild(a);
  //     })
  // }


  dateSelected(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;
    this.selectedDateBakepage = event.value;
  }

  downloadReport(): void {
    if (!this.selectedDate) {
      console.error("Please select a date");
      return;
    }
    // Make API call to download the PDF
    this.downloadPDF();
    this.isProcessing = true;
    // this.downloadPDF();
  }
  downloadPDF() {
    const userId = localStorage.getItem("userId");
    const now = new Date();
    const currentTime = now.toTimeString().split(" ")[0];
    // const apiUrl = `http://localhost:8081/portal/api/report?date=${this.selectedDate}&time=${currentTime}&userId=${userId}`;
    const apiUrl = `${API_REPORT}/report?date=${this.selectedDate}&time=${currentTime}&userId=${userId}`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${this.selectedDate}.pdf`; // Set filename with date
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.openPdfViewer();
      })
      .catch((error) => {
        console.error("Error downloading PDF:", error);
      });
  }

  backPage() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in localStorage");
      this.dialog.open(BackPageComponent, {
        data: "Error: User ID not found",
      });
      return;
    }
    // const apiUrl = `http://localhost:8081/portal/api/bakePage?date=${this.selectedDateBakepage}&userId=${userId}`; // Changed 'userid' to 'userId'
    const apiUrl = `${API_BACKPAGE}?date=${this.selectedDateBakepage}&userId=${userId}`;

    // Send the HTTP GET request with the userId in the headers
    this.http
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${userId}`, // Adjust the header key if necessary
        },
      })
      .subscribe(
        (response) => {
          this.dialog.open(BackPageComponent, {
            width: "60%",
            height: "87%",
            data: response,
          });
        },
        (error) => {
          this.dialog.open(BackPageComponent, {
            data: "Error: " + error.message,
          });
        }
      );
  }

  // downloadPDF() {
  //   // Construct the API URL with the selected date
  //   const apiUrl = `http://localhost:8081/api/bill?date=${this.selectedDate}`;

  //   // Make a GET request to the API endpoint to download the PDF
  //   fetch(apiUrl, {
  //     method: 'GET',
  //   })
  //     .then(response => {
  //       // Check if the response is successful
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.blob(); // Extract the binary data from the response
  //     })
  //     .then(blob => {
  //       // Create a blob URL for the PDF
  //       const url = window.URL.createObjectURL(blob);

  //       // Create a temporary <a> element to trigger the download
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = `${this.selectedDate}.pdf`; // Set filename with date
  //       document.body.appendChild(a);
  //       a.click();

  //       // Clean up by revoking the blob URL and removing the <a> element
  //       window.URL.revokeObjectURL(url);
  //       document.body.removeChild(a);
  //       this.openPdfViewer();
  //     })
  //     .catch(error => {
  //       // Handle any errors
  //       // console.error('Error downloading PDF:', error);
  //     });
  // }

  // backPage() {
  //   // Construct the API URL with the selected date
  //   const apiUrl = `http://localhost:8081/bakePage?date=${this.selectedDateBakepage}`;

  //   this.http.get(apiUrl).subscribe(
  //     response => {
  //       this.dialog.open(BackPageComponent, {
  //         width: '60%',
  //         height: '87%',
  //         data: response
  //       });
  //     },
  //     error => {
  //       this.dialog.open(BackPageComponent, {
  //         data: 'Error: ' + error.message
  //       });
  //     }
  //   );

  // }

  openPDFViewerComponent(fileName: string, pdfData: any) {
    const dialogRef = this.dialog.open(CustomPdfViewerComponent, {
      panelClass: ['dialog-modern-wrapper', 'dialog-lg'],
      data: {
        pdfData: pdfData,
        title: fileName,
        selectedDate: this.selectedDate,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      // this.PDF(fileName, pdfData);
    });
  }

  PDF(fileName: string, pdfData: any) {
    const blob = new Blob([pdfData], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
  }

  openPdfViewer() {
    let fileName1 = `${this.selectedDate}.pdf`;
    this.use.getPDFData(fileName1).subscribe(
      (response: ArrayBuffer) => {
        if (response.byteLength != 0) {
          // Open the custom PDF viewer component with PDF data
          this.openPDFViewerComponent(`${this.selectedDate}.pdf`, response);
        } else {
          this.openPdfViewer();
        }
      },
      (error: any) => {
        // console.error('Error fetching PDF:', error);
        this.isProcessing = false;
      }
    );
  }
  onCustomerSelectionChange(event: any): void {
    const dialogRef = this.dialog.open(MonthlyJamaBakiTotalComponent, {
      panelClass: ['dialog-modern-wrapper', 'dialog-lg'],
      data: {
        customer: this.selectedCustomer,
        startDate: this.startDateJb,
        endDate: this.endDateJb,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        location.reload
      }
    });
  }

  openITReturn() {
    const dialogRef = this.dialog.open(ItReturnComponent, {
      panelClass: ['dialog-modern-wrapper', 'dialog-lg'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getexpensesList();
    });
  }

  getexpensesList() {
    this.use.getexpensesList(this.userId).subscribe((response) => {
      this.expensesList = response ? response.map((item) => item.expensesList) : [];
    });
  }


  expensesExcel(event: any): void {
    if (!this.startDateExpen || !this.endDateExpen) {
      this.notificationService.failure(
        "Please select both start date and end date for Expenses Report"
      );
      return;
    }
    const dialogRef = this.dialog.open(ExpensesExcelComponent, {
      panelClass: ['dialog-modern-wrapper', 'dialog-md'],
      data: {
        expense: this.selectedExpense,
        startDate: this.startDateExpen,
        endDate: this.endDateExpen,
        managerId: this.isManager ? this.userId : null,
        employeeIds: this.isManager ? this.managerEmployeeIds : null,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getexpensesList();
    });
  }

  pdf() {
    if (!this.startDatePdf || !this.endDatePdf) {
      this.notificationService.failure('Please select both start date and end date for P&L PDF.');
      return;
    }
    // For PUMP_MANAGER: use manager's userId which backend maps to all employees
    const targetUserId = this.userId;
    this.loaderService.display(true);

    if (this.xp_petrol_nozzle == 0 || this.powe_diesel_nozzle == 0) {
      const fileName = `Profit&Loss_${this.isManager ? 'Manager_' : ''}${this.startDatePdf}_to_${this.endDatePdf}.pdf`;
      this.use.downloadPdf(targetUserId, this.startDatePdf, this.endDatePdf).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          this.loaderService.display(false);
          this.notificationService.success('P&L PDF downloaded successfully.');
        },
        error: (error) => {
          console.error('Error downloading the file', error);
          this.loaderService.display(false);
          this.notificationService.failure('Failed to generate P&L PDF. Please try again.');
        }
      });
    } else {
      const fileName = `Extra_Profit&Loss_${this.isManager ? 'Manager_' : ''}${this.startDatePdf}_to_${this.endDatePdf}.pdf`;
      this.use.extraPredownloadPdf(targetUserId, this.startDatePdf, this.endDatePdf).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          this.loaderService.display(false);
          this.notificationService.success('P&L PDF downloaded successfully.');
        },
        error: (error) => {
          console.error('Error downloading the file', error);
          this.loaderService.display(false);
          this.notificationService.failure('Failed to generate P&L PDF. Please try again.');
        }
      });
    }
  }


  getUserName() {
    this.use.getUserNameAndNozzle(this.userId).subscribe(
      data => {
        this.xp_petrol_nozzle = Number(data.data.xp_petrol_nozzle);
        this.powe_diesel_nozzle = Number(data.data.powe_diesel_nozzle);
      }
    );
  }

  bakiDetails() {
    if (!this.startDateBaki || !this.endDateBaki) {
      this.notificationService.failure(
        "Please select both start date and end date"
      );
      return;
    }

    const dialogRef = this.dialog.open(BakiDetailsComponent, {
      width: "90%",
      height: "90%",
      data: {
        startDate: this.startDateBaki,
        endDate: this.endDateBaki,
        // Pass managerId and employeeIds so BakiDetailsComponent fetches data scoped to this pump
        managerId: this.isManager ? this.userId : null,
        employeeIds: this.isManager ? this.managerEmployeeIds : null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  getBakiDetails() {
    if (!this.startDateCustomerBaki || !this.endDateCustomerBaki) {
      this.notificationService.failure(
        "Please select both start date and end date"
      );
      return;
    }

    const dialogRef = this.dialog.open(PumpTotalBakiDetailsComponent, {
      width: "90%",
      height: "90%",
      data: {
        startDate: this.startDateCustomerBaki,
        endDate: this.endDateCustomerBaki,
        // Pass managerId and employeeIds so PumpTotalBakiDetailsComponent shows data for THIS pump only
        managerId: this.isManager ? this.userId : null,
        employeeIds: this.isManager ? this.managerEmployeeIds : null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getdata();
      if (this.isManager) { this.getCustomerForManager(); this.getExpensesListForManager(); }
      else { this.getCustomer(); this.getexpensesList(); }
    });
  }


  creditDetails() {
    if (!this.startDateCredit || !this.endDateCredit) {
      this.notificationService.failure(
        "Please select both start date and end date"
      );
      return;
    }

    const dialogRef = this.dialog.open(LoclDetailsComponent, {
      width: "90%",
      height: "90%",
      data: {
        startDate: this.startDateCredit,
        endDate: this.endDateCredit,
        // Pass managerId for multi-employee aggregation
        managerId: this.isManager ? this.userId : null,
        employeeIds: this.isManager ? this.managerEmployeeIds : null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getdata();
      if (this.isManager) { this.getCustomerForManager(); this.getExpensesListForManager(); }
      else { this.getCustomer(); this.getexpensesList(); }
    });
  }

  getDailyReports() {
    this.role = localStorage.getItem('role') || 'Owner';
    const numericUserId = Number(this.userId || localStorage.getItem('userId'));
    if (!isNaN(numericUserId) && numericUserId > 0) {
      if (this.role === 'EMPLOYEE' || this.role === 'employee') {
        // EMPLOYEE: only sees their own submitted reports
        this.use.getEmployeeReports(numericUserId).subscribe({
          next: (reports: any[]) => {
            this.totalSubmissionsCount = reports ? reports.length : 0;
            this.dailyReports = reports || [];
            this.calculateDailyReportsTotal();
          },
          error: (error) => console.error('Error fetching employee daily reports', error)
        });
      } else {
        // PUMP_MANAGER / Owner: sees aggregated reports from ALL their employees
        this.use.getManagerReports(numericUserId).subscribe({
          next: (reports: any[]) => {
            this.totalSubmissionsCount = reports ? reports.length : 0;
            this.dailyReports = this.aggregateReports(reports || []);
            this.calculateDailyReportsTotal();
          },
          error: (error) => console.error('Error fetching manager daily reports', error)
        });
      }
    }
  }

  aggregateReports(reports: any[]): any[] {
    const grouped: { [key: string]: any } = {};
    
    reports.forEach(r => {
      const date = r.reportDate || (r.createdDatetime ? r.createdDatetime.split('T')[0] : '');
      const shift = r.shift || 'Unknown';
      const key = `${date}_${shift}`;
      
      const sales = Number(r.salesAmount) || 0;
      const creator = r.createdBy || 'Unknown';
      
      let petrol = 0;
      let diesel = 0;
      let xpPetrol = 0;
      let powerDiesel = 0;
      
      let stocks: any = null;
      if (typeof r.stockDetails === 'string') {
        try {
          stocks = JSON.parse(r.stockDetails);
        } catch (e) {
          stocks = null;
        }
      } else if (r.stockDetails && typeof r.stockDetails === 'object') {
        stocks = r.stockDetails;
      }
      
      if (stocks) {
        if (Array.isArray(stocks)) {
          stocks.forEach((s: any) => {
            const val = Number(s.value) || 0;
            if (s.fuel === 'petrol' || s.fuel === 'PetrolRemaining') petrol += val;
            else if (s.fuel === 'diesel' || s.fuel === 'DieselRemaining') diesel += val;
            else if (s.fuel === 'xpPetrol' || s.fuel === 'XpPetrolRemaining') xpPetrol += val;
            else if (s.fuel === 'powerDiesel' || s.fuel === 'PowerDieselRemaining') powerDiesel += val;
          });
        } else {
          petrol = Number(stocks.petrolRemaining) || Number(stocks.petrol) || 0;
          diesel = Number(stocks.dieselRemaining) || Number(stocks.diesel) || 0;
          xpPetrol = Number(stocks.xpPetrolRemaining) || Number(stocks.xpPetrol) || 0;
          powerDiesel = Number(stocks.powerDieselRemaining) || Number(stocks.powerDiesel) || 0;
        }
      }
      
      if (!grouped[key]) {
        grouped[key] = {
          reportId: r.reportId,
          reportDate: date,
          reportTime: r.reportTime || '',
          createdDatetime: r.createdDatetime || '',
          shift: shift,
          createdByList: [creator],
          salesAmount: sales,
          petrolRemaining: petrol,
          dieselRemaining: diesel,
          xpPetrolRemaining: xpPetrol,
          powerDieselRemaining: powerDiesel
        };
      } else {
        grouped[key].salesAmount += sales;
        grouped[key].petrolRemaining += petrol;
        grouped[key].dieselRemaining += diesel;
        grouped[key].xpPetrolRemaining += xpPetrol;
        grouped[key].powerDieselRemaining += powerDiesel;
        
        if (!grouped[key].createdByList.includes(creator)) {
          grouped[key].createdByList.push(creator);
        }
        
        if (r.reportTime && (!grouped[key].reportTime || r.reportTime > grouped[key].reportTime)) {
          grouped[key].reportTime = r.reportTime;
        }
        if (r.createdDatetime && (!grouped[key].createdDatetime || r.createdDatetime > grouped[key].createdDatetime)) {
          grouped[key].createdDatetime = r.createdDatetime;
        }
      }
    });
    
    return Object.values(grouped).map(g => {
      const stockObj = {
        petrolRemaining: g.petrolRemaining,
        dieselRemaining: g.dieselRemaining,
        xpPetrolRemaining: g.xpPetrolRemaining,
        powerDieselRemaining: g.powerDieselRemaining
      };
      
      return {
        reportId: g.reportId,
        reportDate: g.reportDate,
        reportTime: g.reportTime,
        createdDatetime: g.createdDatetime,
        shift: g.shift,
        createdBy: g.createdByList.join(' + '),
        salesAmount: g.salesAmount,
        stockDetails: JSON.stringify(stockObj)
      };
    });
  }

  calculateDailyReportsTotal() {
    this.totalReportsSales = this.dailyReports.reduce((sum, r) => sum + (r.salesAmount || 0), 0);
  }

  parseStockDetails(stockDetailsStr: string): any {
    try {
      return stockDetailsStr ? JSON.parse(stockDetailsStr) : null;
    } catch (e) {
      return null;
    }
  }
}
