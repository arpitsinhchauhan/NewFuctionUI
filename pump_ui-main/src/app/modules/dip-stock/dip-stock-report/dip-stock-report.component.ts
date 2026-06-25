import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DipStock } from '../../../models/DipStock';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { DipTableComponent } from '../dip-table/dip-table.component';
import { API_PD_DIP_LIST_POINT } from 'app/serviceult';
import { PurchaseReportComponent } from '../../table-list/purchase-report/purchase-report.component';

@Component({
  selector: 'app-dip-stock-report',
  templateUrl: './dip-stock-report.component.html',
  styleUrls: ['./dip-stock-report.component.css']
})
export class DipStockReportComponent implements OnInit {
  isReload: boolean;
  petrolvolume: string = ''; 
  dielsevolume: string = '';
  pdip: string = '';
  dieseldip: string = '';
  pvalue: number | undefined;
  dvalue: number | undefined;
    purchaDipStockseDetails: DipStock = {
    date: new Date(),
    petroldip: '',
    pvalue: 0,
    dieseldip: '',
    dvalue: 0,
    userId: ''
  };
  userId: string;
  selectedItems: any[] = [];
  

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public dip: any,
    public dialogRef: MatDialogRef<PurchaseReportComponent>,
    private notificationService: NotificationService
  ) {
   if (data) {
    this.purchaDipStockseDetails = { ...data };
    this.pdip = data.petroldip;
    this.pvalue = data.pvalue;
    this.dieseldip = data.dieseldip;
    this.dvalue = data.dvalue;

    if (data.petroldip === null && data.pvalue === null && data.dieseldip === null && data.dvalue === null) {
      data.type = 'add'; 
    } else if(data){
      data.type = 'edit';  
    }
  }
  }
  
  ngOnInit(): void {
    if (this.dip && this.dip.date) {
      this.purchaDipStockseDetails.date = this.dip.date;
    }
    this.userId = localStorage.getItem('userId');
    this.use.selectedItems$.subscribe(items => {
      this.selectedItems = items;
      // Handle the received data here
      this.calculateTotalValues();
      // this.assignIdValues();
    });
  }

  calculateTotalValues() {
    // Calculate total values based on selected items
    if (this.selectedItems.length) {
      this.pdip = this.selectedItems[0].dip;
      this.petrolvolume = this.selectedItems[0].volume;
      this.dieseldip = this.selectedItems[1]?.dip || '';
      this.dielsevolume = this.selectedItems[1]?.volume || '';
    }
  }

  openComponent() {
    const dialogRef = this.dialog.open(DipTableComponent, {
      width: '60%',
      height: '70%',
    });
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

  Edit(purchaDipStockseDetails: any) {
    this.purchaDipStockseDetails.petroldip = this.pdip;
    this.purchaDipStockseDetails.pvalue = this.pvalue;
    this.purchaDipStockseDetails.dieseldip = this.dieseldip;
    this.purchaDipStockseDetails.dvalue = this.dvalue;
    this.purchaDipStockseDetails.userId = this.userId;
    this.use.getUpdateDip(purchaDipStockseDetails).subscribe(
      (response) => {
        this.notificationService.success('Dipstock data updated successfully');
        this.isReload = true;
        this.dialogRef.close({ 'isReload': this.isReload });
      },
      (error) => {
        console.error('Error updating society data:', error);
        this.isReload = false;
        this.dialogRef.close({ 'isReload': this.isReload });
      }
    );
  }
  fetchPvalue(): void {
    if (this.pdip) {
      this.http.get<number>(`${API_PD_DIP_LIST_POINT}/${this.pdip}`).subscribe(
        (data: number) => {
          this.pvalue = data;
        },
        (error) => {
          console.error('Error fetching Pvalue', error);
        }
      );
    }
  }

  fetchDvalue(): void {
    if (this.dieseldip) {
      this.http.get<number>(`${API_PD_DIP_LIST_POINT}/${this.dieseldip}`).subscribe(
        (data: number) => {
          this.dvalue = data;
        },
        (error) => {
          console.error('Error fetching Dvalue', error);
        }
      );
    }
  }

  logData(): void {
    this.purchaDipStockseDetails.petroldip = this.pdip;
    this.purchaDipStockseDetails.pvalue = this.pvalue;
    this.purchaDipStockseDetails.dieseldip = this.dieseldip;
    this.purchaDipStockseDetails.dvalue = this.dvalue;
    this.purchaDipStockseDetails.userId = this.userId;
    {
      this.use.addDipstock(this.purchaDipStockseDetails).subscribe(
        (response) => {
          this.notificationService.success("DipStock Details Successfully added.");
          this.isReload = true;
          this.dialogRef.close({ 'isReload': this.isReload });
        },
        (error) => {
          if (error.status === 409) {
            this.notificationService.failure("DipStock with this date already exists. Details not saved.");
            this.isReload = false;
        this.dialogRef.close({ 'isReload': this.isReload });
          }
        }
      );
    }
  }
}


