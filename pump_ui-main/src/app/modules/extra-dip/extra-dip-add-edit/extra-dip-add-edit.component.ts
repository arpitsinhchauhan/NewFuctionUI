import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { ExtraDipTableComponent } from '../extra-dip-table/extra-dip-table.component';
import { API_EXTRA_PD_DIP_LIST_POINT } from 'app/serviceult';
import { extraDipStock } from 'app/models/extraDipStock';

@Component({
  selector: 'app-extra-dip-add-edit',
  templateUrl: './extra-dip-add-edit.component.html',
  styleUrls: ['./extra-dip-add-edit.component.scss']
})
export class ExtraDipAddEditComponent implements OnInit {
  isReload: boolean = false;
  isExistingEntry: boolean = false;
  isCheckingDate: boolean = false;
  extraDipStock: extraDipStock[];
  petrolvolume: string = '';
  dielsevolume: string = '';
  extraPdip: string = '';
  extra_dieseldip: string = '';
  extra_pvalue: number | undefined;
  extra_dvalue: number | undefined;
  extraDipvalueDetails: extraDipStock = {
    date: new Date(),
    extra_petroldip: '',
    extra_pvalue: 0,
    extra_dieseldip: '',
    extra_dvalue: 0,
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
    public dialogRef: MatDialogRef<ExtraDipAddEditComponent>,
    private notificationService: NotificationService
  ) {
    if (data) {
      this.extraDipvalueDetails = { ...data };
      this.extraPdip = data.extra_petroldip;
      this.extra_pvalue = data.extra_pvalue;
      this.extra_dieseldip = data.extra_dieseldip;
      this.extra_dvalue = data.extra_dvalue;

      if (
        !data.extra_petroldip &&
        !data.extra_dvalue &&
        !data.extra_dieseldip &&
        !data.extra_pvalue
      ) {
        data.type = 'add';
        this.isExistingEntry = false;
      } else {
        data.type = 'edit';
        this.isExistingEntry = true;
      }
    }
  }

  ngOnInit(): void {
    if (this.dip && this.dip.date) {
      this.extraDipvalueDetails.date = this.use.getFormattedDate(this.dip.date);
    } else if (this.extraDipvalueDetails.date) {
      this.extraDipvalueDetails.date = this.use.getFormattedDate(this.extraDipvalueDetails.date);
    } else {
      this.extraDipvalueDetails.date = this.use.getFormattedDate(new Date());
    }

    this.userId = this.data?.userId || this.dip?.userId || localStorage.getItem('userId');

    this.use.selectedItems$.subscribe(items => {
      this.selectedItems = items;
      this.calculateTotalValues();
    });

    if (this.extraDipvalueDetails.date) {
      const formatted = this.use.getFormattedDate(this.extraDipvalueDetails.date);
      this.extraDipvalueDetails.date = formatted as any;
      this.checkExistingEntryForDate(formatted);
    }
  }

  onDateChange(): void {
    if (!this.extraDipvalueDetails.date) return;
    const formattedDate = this.use.getFormattedDate(this.extraDipvalueDetails.date);
    this.extraDipvalueDetails.date = formattedDate;
    this.checkExistingEntryForDate(formattedDate);
  }

  checkExistingEntryForDate(formattedDate: string): void {
    const uid = this.userId || localStorage.getItem('userId');
    this.isCheckingDate = true;
    this.use.getextraDipList(formattedDate, uid).subscribe(
      (data) => {
        this.isCheckingDate = false;
        if (data && data.length > 0) {
          this.isExistingEntry = true;
          if (this.data) {
            this.data.type = 'edit';
          }
          if (data[0][2] != null) this.extraPdip = data[0][2];
          if (data[0][3] != null) this.extra_pvalue = data[0][3];
          if (data[0][0] != null) this.extra_dieseldip = data[0][0];
          if (data[0][1] != null) this.extra_dvalue = data[0][1];
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
      this.extraPdip = this.selectedItems[0].dip;
      this.petrolvolume = this.selectedItems[0].volume;
      this.extra_dieseldip = this.selectedItems[1]?.dip || '';
      this.dielsevolume = this.selectedItems[1]?.volume || '';
    }
  }

  openComponent() {
    const dialogRef = this.dialog.open(ExtraDipTableComponent, {
      width: '60%',
      height: '70%',
    });
  }

  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }

  saveOrUpdate(): void {
    this.extraDipvalueDetails.extra_petroldip = this.extraPdip || '';
    this.extraDipvalueDetails.extra_pvalue = this.extra_pvalue || 0;
    this.extraDipvalueDetails.extra_dieseldip = this.extra_dieseldip || '';
    this.extraDipvalueDetails.extra_dvalue = this.extra_dvalue || 0;
    this.extraDipvalueDetails.userId = this.userId || localStorage.getItem('userId');
    this.extraDipvalueDetails.date = this.use.getFormattedDate(this.extraDipvalueDetails.date);

    this.use.addextraDipstock(this.extraDipvalueDetails).subscribe(
      (response) => {
        const msg = (this.isExistingEntry || this.data?.type === 'edit')
          ? 'Extra DipStock details updated successfully.'
          : 'Extra DipStock details saved successfully.';
        this.notificationService.success(msg);
        this.isReload = true;
        this.dialogRef.close({ 'isReload': this.isReload });
      },
      (error) => {
        this.use.getUpdateExtraDip(this.extraDipvalueDetails).subscribe(
          (updRes) => {
            this.notificationService.success('Extra DipStock details updated successfully.');
            this.isReload = true;
            this.dialogRef.close({ 'isReload': this.isReload });
          },
          (updErr) => {
            this.notificationService.failure('Failed to save Extra DipStock details.');
            this.isReload = false;
            this.dialogRef.close({ 'isReload': this.isReload });
          }
        );
      }
    );
  }

  Edit(extraDipvalueDetails: any) {
    this.saveOrUpdate();
  }

  logData(): void {
    this.saveOrUpdate();
  }

  fetchPvalue(): void {
    if (this.extraPdip) {
      this.http.get<number>(`${API_EXTRA_PD_DIP_LIST_POINT}/${this.extraPdip}`).subscribe(
        (data: number) => {
          this.extra_pvalue = data;
        },
        (error) => {
          console.error('Error fetching Pvalue', error);
        }
      );
    }
  }

  fetchDvalue(): void {
    if (this.extra_dieseldip) {
      this.http.get<number>(`${API_EXTRA_PD_DIP_LIST_POINT}/${this.extra_dieseldip}`).subscribe(
        (data: number) => {
          this.extra_dvalue = data;
        },
        (error) => {
          console.error('Error fetching Dvalue', error);
        }
      );
    }
  }
}
