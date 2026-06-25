import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { API_EMPLOYEE_DETAILS_ADD } from 'app/serviceult';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  name!: string;
  isReload: boolean;
  accountNumber!: string;
  phoneNumber!: string;
  employeeId!: string;
  photo!: File;

  constructor(private http: HttpClient, public dialogRef: MatDialogRef<EmployeeComponent>) { }

  ngOnInit(): void {
  }

  onFileChange(event: any) {
    this.photo = event.target.files[0];
  }

  saveEmployee(formValues: any): void {
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('accountNumber', this.accountNumber);
    formData.append('phoneNumber', this.phoneNumber);
    formData.append('employeeId', this.employeeId);
    formData.append('photo', this.photo);
    // (formData);
    const userId = localStorage.getItem('userId');
    if (userId) {
      formData.append('userId', userId);
    } else {
      console.error('User ID not found in localStorage');
    }
    this.http.post(API_EMPLOYEE_DETAILS_ADD, formData).subscribe(
      (response) => {
        this.dialogRef.close();
      },
      (error) => {
        console.error('Error saving employee', error);
      }
    );
  }
  cancel() {
    this.dialogRef.close({ 'isReload': this.isReload });
  }
}


