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
  isReload: boolean = false;
  isExistingEntry: boolean = false;
  isCheckingDate: boolean = false;
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dip: any,
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
        this.isExistingEntry = false;
      } else if (data.petroldip || data.dieseldip || data.type === 'edit') {
        data.type = 'edit';
        this.isExistingEntry = true;
      }
    }
  }

  ngOnInit(): void {
    if (this.dip && this.dip.date) {
      this.purchaDipStockseDetails.date = this.use.getFormattedDate(this.dip.date);
    } else if (this.purchaDipStockseDetails.date) {
      this.purchaDipStockseDetails.date = this.use.getFormattedDate(this.purchaDipStockseDetails.date);
    } else {
      this.purchaDipStockseDetails.date = this.use.getFormattedDate(new Date());
    }

    this.userId = this.data?.userId || this.dip?.userId || localStorage.getItem('userId');

    this.use.selectedItems$.subscribe(items => {
      this.selectedItems = items;
      this.calculateTotalValues();
    });

    if (this.purchaDipStockseDetails.date) {
      const formatted = this.use.getFormattedDate(this.purchaDipStockseDetails.date);
      this.purchaDipStockseDetails.date = formatted as any;
      this.checkExistingEntryForDate(formatted);
    }
  }

  onDateChange(): void {
    if (!this.purchaDipStockseDetails.date) return;
    const formattedDate = this.use.getFormattedDate(this.purchaDipStockseDetails.date);
    this.purchaDipStockseDetails.date = formattedDate;
    this.checkExistingEntryForDate(formattedDate);
  }

  checkExistingEntryForDate(formattedDate: string): void {
    const uid = this.userId || localStorage.getItem('userId');
    this.isCheckingDate = true;
    this.use.getDipList(formattedDate, uid).subscribe(
      (data) => {
        this.isCheckingDate = false;
        if (data && data.length > 0 && Array.isArray(data[0])) {
          this.isExistingEntry = true;
          if (this.data) {
            this.data.type = 'edit';
          }
          if (data[0][2] != null) this.pdip = data[0][2];
          if (data[0][3] != null) this.pvalue = data[0][3];
          if (data[0][0] != null) this.dieseldip = data[0][0];
          if (data[0][1] != null) this.dvalue = data[0][1];
        } else {
          this.isExistingEntry = false;
          if (this.data && !this.data.id) {
            this.data.type = 'add';
          }
        }
      },
      (error) => {
        this.isCheckingDate = false;
      }
    );
  }

  calculateTotalValues() {
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

  saveOrUpdate(): void {
    this.purchaDipStockseDetails.petroldip = this.pdip || '';
    this.purchaDipStockseDetails.pvalue = this.pvalue || 0;
    this.purchaDipStockseDetails.dieseldip = this.dieseldip || '';
    this.purchaDipStockseDetails.dvalue = this.dvalue || 0;
    this.purchaDipStockseDetails.userId = this.userId || localStorage.getItem('userId');
    this.purchaDipStockseDetails.date = this.use.getFormattedDate(this.purchaDipStockseDetails.date);

    this.use.addDipstock(this.purchaDipStockseDetails).subscribe(
      (response) => {
        const msg = (this.isExistingEntry || this.data?.type === 'edit')
          ? 'DipStock details updated successfully.'
          : 'DipStock details saved successfully.';
        this.notificationService.success(msg);
        this.isReload = true;
        this.dialogRef.close({ 'isReload': this.isReload });
      },
      (error) => {
        this.use.getUpdateDip(this.purchaDipStockseDetails).subscribe(
          (updRes) => {
            this.notificationService.success('DipStock details updated successfully.');
            this.isReload = true;
            this.dialogRef.close({ 'isReload': this.isReload });
          },
          (updErr) => {
            this.notificationService.failure('Failed to save DipStock details.');
            this.isReload = false;
            this.dialogRef.close({ 'isReload': this.isReload });
          }
        );
      }
    );
  }

  Edit(purchaDipStockseDetails: any) {
    this.saveOrUpdate();
  }

  logData(): void {
    this.saveOrUpdate();
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
}
