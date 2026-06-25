import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_LOCL_DETAILS_DELETE } from 'app/serviceult';
import { CreditTypeComponent } from './credit-type/credit-type.component';

@Component({
  selector: 'app-addlocl-details',
  templateUrl: './addlocl-details.component.html',
  styleUrls: ['./addlocl-details.component.scss']
})
export class AddloclDetailsComponent implements OnInit {

  loclDetails = {
    id: '',
    date: '',
    credit: '',
    balance: '',
    remark: '',
    user_id: ''
  };
  purchaDipStockseDetails = {
    date: ''
  };
  row: any[] = [];
  userId: string;
  isReload: boolean;
  creditTypeList: string[] = [];


  constructor(private http: HttpClient, private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddloclDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private use: UserServiceService,
    private notificationService: NotificationService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    if (this.data && this.data.date) {
      this.purchaDipStockseDetails.date = this.data.date;
    }
    this.getloclDetails();
    this.getCreditList();
  }

  getloclDetails() {
    this.use.getAllcreditNOteIOCL(this.userId).subscribe(
      (response: any) => {
        if (response && response.length > 0) {
          const selectedDate = this.purchaDipStockseDetails.date;
          const filtered = response.filter(item => item.date === selectedDate);
          this.row = filtered.map(item => ({
            id: item.id,
            date: item.date,
            credit: item.credit,
            balance: item.balance,
            remark: item.remark,
            userId: item.user_id
          }));
        }
      },
      error => {
        console.error('Error fetching LOCL details', error);
      }
    );
  }

  getCreditList() {
    this.use.getcreditList(this.userId).subscribe(
      (res: any) => {
        this.creditTypeList = res.map(item => item.creditList);
      },
      error => {
        console.error('Error fetching LOCL details', error);
      }
    );
  }

  addTable() {
    this.row.push({
      id: '',
      date: this.purchaDipStockseDetails.date,
      credit: '',
      balance: '',
      remark: '',
      userId: this.userId
    });
  }

  order() {
    this.row = this.row.map(item => ({
      ...item,
      date: this.purchaDipStockseDetails.date,
      userId: this.userId
    }));
    this.use.saveLOCLDetails(this.row).subscribe(
      res => {
        this.notificationService.success('LOCLCredit Details added successfully');
        this.dialogRef.close({ 'isReload': this.isReload });
      },
      err => {
        this.notificationService.failure('Failed to LOCLCredit Details');
        this.dialogRef.close({ 'isReload': this.isReload });
      }
    );
  }

  deleteRow(index: number) {
    const item = this.row[index];

    if (item.id) {
      this.http.delete(`${API_LOCL_DETAILS_DELETE}/${item.id}`).subscribe({
        next: () => {
          this.notificationService.success("Row deleted successfully.");
          this.row.splice(index, 1);
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


  cancel() {
    this.loclDetails = {
      id: '',
      date: '',
      credit: '',
      balance: '',
      remark: '',
      user_id: ''
    };
    this.row = [];
    this.dialogRef.close({ 'isReload': this.isReload });
  }

  totalPrice() {
    let total = 0;
    this.row.forEach(item => {
      const value = parseFloat(item.balance);
      if (!isNaN(value)) {
        total += value;
      }
    });
    return total;
  }

  creditType() {
    const dialogRef = this.dialog.open(CreditTypeComponent, {
      width: "40%",
      height: "30%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getloclDetails();
      this.getCreditList();
    });
  }

}