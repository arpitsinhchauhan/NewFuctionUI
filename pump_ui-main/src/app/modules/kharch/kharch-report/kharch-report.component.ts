import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NotificationService } from "app/services/notification.service";
import { UserServiceService } from "app/services/user-service.service";
import { API_KHARCH_ADD, API_KHARCH_DELETE, API_KHARCH_LIST } from "app/serviceult";
import { Observable, startWith, map, of } from "rxjs";
import { ExpensesListComponent } from "../expenses-list/expenses-list.component";

@Component({
  selector: "app-kharch-report",
  templateUrl: "./kharch-report.component.html",
  styleUrls: ["./kharch-report.component.css"],
})
export class KharchReportComponent implements OnInit {
  total = 0;
  isReload: boolean;
  data: any = { name: [] };
  selectedDate!: Date | null;
  expenseFilterCtrl = new FormControl();
  purchaDipStockseDetails: any = {
    date: "",
  };
  searchText: string = "";
  filteredExpenses: string[] = [];
  // filteredExpensesList: Observable<string[]>;
  expensesList: string[] = [
    // "ASSOSIASAN FEE EXP",
    // "BANK CHARGES",
    // "BANK INTREST",
    // "BREAK FAST OPANING EXP AC",
    // "BSNL RECHARG EXP",
    // "BUILDING MARAMAT EXP",
    // "VISAN CEMERA EXP",
    // "ELETRIC BILL EXP",
    // "FIRE BOTTEL",
    // "LISAN FEES EXP",
    // "MATI PURANI EXP",
    // "PAINTING BUILDING EXP",
    // "PROFESONAL VERO EXP",
    // "SBI GENERAL INSURANCE EXP",
    // "RENT TID GJ001158 SBI POS MASHIN CHARGES",
    // "SAFAI EXP A/C",
    // "SALERY EXP A/C",
    // "STEMPING EXP",
    // "STESANARY EXP A/C",
    // "UNIFORM EXP",
    // "TRAVELING EXP A/C",
    // "VAKIL FEES EXP",
    // "VAT A/C",
    // "VYAJ",
    // "REPORT KHARCH",
  ];
  userId: string;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<KharchReportComponent>,
    private notificationService: NotificationService,
    private use: UserServiceService,
    @Inject(MAT_DIALOG_DATA) public kharch: any, private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.use.dialogZIndexAdjustment();
    this.userId = localStorage.getItem("userId");
    if (this.kharch && this.kharch.date) {
      this.purchaDipStockseDetails.date = this.kharch.date;
    }
    this.getkharch();
    this.getexpensesList();
    if (this.row.length > 0) {
      this.row[0].idkharch = "1";
    }
  }

  private _filterExpenses(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.expensesList.filter((expense) =>
      expense.toLowerCase().includes(filterValue)
    );
  }

  order() {
    if (!this.isFormValid()) {
      this.notificationService.failure("Please fill all required fields.");
      return;
    }
    const data = {
      // date: this.purchaDipStockseDetails.date,
      expenses: this.row,
    };
    // Send data to backend
    this.http.post<any>(API_KHARCH_ADD, this.row).subscribe((response) => {
      // const responseData = response.expenses;
      this.notificationService.success("Kharch data succefully add.");
      this.purchaDipStockseDetails.date = null;
      this.row = [];
      this.dialogRef.close();
    });
  }
  isFormValid(): boolean {
    if (!this.purchaDipStockseDetails.date) {
      return false;
    }
    for (let item of this.row) {
      if (!item.expenses || !item.price || !item.notes) {
        return false;
      }
    }
    return true;
  }
  purchaseDetails: any = {
    date: "", // You can set default date if needed
  };
  row: any[] = [];
  lastRowId: number = 0;

  addTable() {
    // Add a new row to the table
    if (this.purchaDipStockseDetails.date) {
      this.lastRowId++;
      this.userId = localStorage.getItem("userId");
      // this.row.push({ id: '', date: this.purchaDipStockseDetails.date, notes: '', price: '' });
      const newRow = {
        idkharch: this.lastRowId,
        date: this.purchaDipStockseDetails.date,
        expenses: "",
        price: "",
        notes: "",
        userId: this.userId,
      };
      this.row.push(newRow);
    } else {
      this.notificationService.failure(
        "Please fill in all the required fields before adding a new row."
      );
    }
  }

  deleteRow(index: number) {
    const item = this.row[index];
    if (item.idkharch) {
      this.http.delete(`${API_KHARCH_DELETE}/${item.idkharch}`).subscribe({
        next: () => {
          this.notificationService.success("Row deleted successfully.");
          this.row.splice(index, 1); // remove from UI after backend confirms
        },
        error: () => {
          this.notificationService.failure("Failed to delete row from backend.");
        }
      });
    } else {
      this.row.splice(index, 1);
      this.notificationService.success("Row removed locally.");
    }
  }

  totalPrice() {
    let sum = 0;
    this.row.forEach((item) => {
      sum += parseInt(item.price || "0", 10);
    });
    return sum;
  }

  cancel() {
    this.dialogRef.close({ isReload: this.isReload });
  }

  getexpensesList() {
    this.use.getexpensesList(this.userId).subscribe((response) => {
      this.expensesList = response.map((item) => item.expensesList);
      this.filteredExpenses = [...this.expensesList]; // clone full list
    });
  }

  onSearchChange() {
    const query = this.searchText.toLowerCase();
    this.filteredExpenses = this.expensesList.filter((expense) =>
      expense.toLowerCase().includes(query)
    );
  }

  onSelectOpened() {
    this.searchText = "";
    this.filteredExpenses = [...this.expensesList];
  }

  expense() {
    const dialogRef = this.dialog.open(ExpensesListComponent, {
      width: "40%",
      // height: "30%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getexpensesList();
    });
  }

  getkharch() {
    this.userId = localStorage.getItem("userId");
    const params = { userId: this.userId };
    this.http.get(API_KHARCH_LIST, { params }).subscribe((data: any[]) => {
      if (this.kharch?.date) {
        this.row = data.filter(
          (item) => new Date(item.date).toDateString() === new Date(this.kharch.date).toDateString()
        );
      } else {
        this.row = [];
      }
    });
  }

  compareStrings(s1: any, s2: any): boolean {
    if (s1 === s2) return true;
    if (!s1 || !s2) return false;
    return s1.toString().trim().toLowerCase() === s2.toString().trim().toLowerCase();
  }
}
