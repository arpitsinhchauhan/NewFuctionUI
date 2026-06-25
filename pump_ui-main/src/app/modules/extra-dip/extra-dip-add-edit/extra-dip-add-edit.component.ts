import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DipStock } from 'app/models/DipStock';
import { extraDipStock } from 'app/models/extraDipStock';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_EXTRA_PD_DIP_LIST_POINT } from 'app/serviceult';
import { ExtraDipTableComponent } from '../extra-dip-table/extra-dip-table.component';

@Component({
  selector: 'app-extra-dip-add-edit',
  templateUrl: './extra-dip-add-edit.component.html',
  styleUrls: ['./extra-dip-add-edit.component.scss']
})
export class ExtraDipAddEditComponent implements OnInit {

  isReload: boolean;
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public dip: any,
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
      } else {
        data.type = 'edit';
      }
    }
  }

  ngOnInit(): void {
    if (this.dip && this.dip.date) {
      this.extraDipvalueDetails.date = this.dip.date;
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

  Edit(extraDipvalueDetails: any) {
    this.extraDipvalueDetails.extra_petroldip = this.extraPdip;
    this.extraDipvalueDetails.extra_pvalue = this.extra_pvalue;
    this.extraDipvalueDetails.extra_dieseldip = this.extra_dieseldip;
    this.extraDipvalueDetails.extra_dvalue = this.extra_dvalue;
    this.extraDipvalueDetails.userId = this.userId;
    this.use.getUpdateExtraDip(extraDipvalueDetails).subscribe(
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

  logData(): void {
    this.extraDipvalueDetails.extra_petroldip = this.extraPdip;
    this.extraDipvalueDetails.extra_pvalue = this.extra_pvalue;
    this.extraDipvalueDetails.extra_dieseldip = this.extra_dieseldip;
    this.extraDipvalueDetails.extra_dvalue = this.extra_dvalue;
    this.extraDipvalueDetails.userId = this.userId;

    this.use.addextraDipstock(this.extraDipvalueDetails).subscribe(
      (response) => {
        this.notificationService.success("Extra DipStock Details Successfully added.");
        this.isReload = true;
        this.dialogRef.close({ 'isReload': this.isReload });
      },
      (error) => {
        if (error.status === 409) {
          this.notificationService.failure("Extra DipStock with this date already exists. Details not saved.");
          this.isReload = false;
          this.dialogRef.close({ 'isReload': this.isReload });
        }
      }
    );
  }

}


