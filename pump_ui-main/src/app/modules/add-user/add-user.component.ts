import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangePasswordComponent } from 'app/components/change-password/change-password.component';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  isReload = false;
  userForm!: FormGroup;
  showPumpFields = true;

  /** True when nozzle values are auto-set from manager profile (editing/adding an employee) */
  isNozzleAutoSet = false;
  managerNozzleData: any = null;

  /** True when Petrol Pump Name is auto-set (editing/adding an employee) */
  isPumpNameAutoSet = false;

  /** True when PUMP_MANAGER is editing their OWN account → all fields editable */
  isEditingSelf = false;

  pumpOptions: number[] = Array.from({ length: 10 }, (_, i) => i);
  loggedInRole = '';
  availableRoles: any[] = [];

  constructor(
    private use: UserServiceService,
    public dialogRef: MatDialogRef<AddUserComponent>,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.loggedInRole = localStorage.getItem('role') || 'SUPER_ADMIN';
    if (this.loggedInRole === 'SUPER_ADMIN' || this.loggedInRole === 'admin') {
      this.availableRoles = [
        { value: 'PUMP_MANAGER', label: 'Pump Manager' }
      ];
    } else if (this.loggedInRole === 'PUMP_MANAGER' || this.loggedInRole === 'user') {
      this.availableRoles = [
        { value: 'EMPLOYEE', label: 'Employee' }
      ];
    } else {
      this.availableRoles = [
        { value: 'SUPER_ADMIN', label: 'Super Admin' },
        { value: 'PUMP_MANAGER', label: 'Pump Manager' },
        { value: 'EMPLOYEE', label: 'Employee' }
      ];
    }

    this.userForm = this.fb.group({
      firstName:        ['', Validators.required],
      lastName:         ['', Validators.required],
      username:         ['', Validators.required],
      password:         [''],
      phoneNumber:      ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      role:             ['', Validators.required],
      email:            ['', [Validators.required, Validators.email]],
      petrol_nozzle:    [''],
      diesel_nozzle:    [''],
      xp_petrol_nozzle: [''],
      powe_diesel_nozzle: [''],
    });

    // EDIT MODE
    if (this.data) {
      this.userForm.patchValue({
        ...this.data,
        password: '', 
        petrol_nozzle: +this.data.petrol_nozzle,
        diesel_nozzle: +this.data.diesel_nozzle,
        xp_petrol_nozzle: +this.data.xp_petrol_nozzle,
        powe_diesel_nozzle: +this.data.powe_diesel_nozzle,
      });
    } else {
      // ADD MODE → password required
      this.userForm.get('password')?.setValidators(Validators.required);
      this.userForm.get('password')?.updateValueAndValidity();
    }

    // Role-based pump fields
    this.userForm.get('role')?.valueChanges.subscribe(role => {
      this.showPumpFields = role?.toLowerCase() !== 'admin';
    });

    this.showPumpFields =
      this.userForm.get('role')?.value?.toLowerCase() !== 'admin';

    // ✅ PUMP_MANAGER: auto-fill pump name + nozzle for EMPLOYEES
    //    But NOT when the manager is editing their own account
    if (this.loggedInRole === 'PUMP_MANAGER' || this.loggedInRole === 'user') {
      const managerId = localStorage.getItem('userId');

      // Detect if the manager is editing their OWN record
      this.isEditingSelf = !!(this.data && this.data.id && String(this.data.id) === String(managerId));

      if (managerId && !this.isEditingSelf) {
        // ── EMPLOYEE mode: lock pump name + nozzle to manager's values ──
        const managerPumpName = localStorage.getItem('firstName') || '';
        if (managerPumpName) {
          this.isPumpNameAutoSet = true;
          this.userForm.patchValue({ firstName: managerPumpName });
          this.userForm.get('firstName')?.disable();
        }

        // Fetch manager's live nozzle data and override employee's values
        this.use.getUserNameAndNozzle(managerId).subscribe((res: any) => {
          const nozzleData = res?.data || res;
          if (nozzleData) {
            this.managerNozzleData = nozzleData;
            this.isNozzleAutoSet = true;
            this.userForm.patchValue({
              petrol_nozzle:      +nozzleData.petrol_nozzle      || 0,
              diesel_nozzle:      +nozzleData.diesel_nozzle      || 0,
              xp_petrol_nozzle:   +nozzleData.xp_petrol_nozzle   || 0,
              powe_diesel_nozzle: +nozzleData.powe_diesel_nozzle  || 0,
            });
          }
        });

        // ADD MODE only: password is required
        if (!this.data) {
          this.userForm.get('password')?.setValidators(Validators.required);
          this.userForm.get('password')?.updateValueAndValidity();
        }

      } else if (this.isEditingSelf) {
        // ── SELF-EDIT mode: manager edits own account, all fields free ──
        // Fields already patched from this.data above; nothing to lock.
        // Any changes to firstName/nozzles will cascade to employees (backend).
      }
    }
  }


  // ✅ ADD USER
  addUser(): void {
    if (!this.validateForm()) return;

    const formValue = { ...this.userForm.value };
    const currentUserId = localStorage.getItem('userId');

    if (this.loggedInRole === 'PUMP_MANAGER' || this.loggedInRole === 'user') {
      formValue.role = 'EMPLOYEE';
      formValue.managerId = currentUserId ? +currentUserId : null;
      const managerPumpId = localStorage.getItem('pumpId');
      formValue.pumpId = managerPumpId ? +managerPumpId : null;
      // ✅ Restore disabled firstName (pump name) from localStorage
      if (this.isPumpNameAutoSet) {
        formValue.firstName = localStorage.getItem('firstName') || formValue.firstName;
      }
      // ✅ Ensure auto-set nozzle values are sent even if fields were disabled
      if (this.isNozzleAutoSet && this.managerNozzleData) {
        formValue.petrol_nozzle = +this.managerNozzleData.petrol_nozzle || 0;
        formValue.diesel_nozzle = +this.managerNozzleData.diesel_nozzle || 0;
        formValue.xp_petrol_nozzle = +this.managerNozzleData.xp_petrol_nozzle || 0;
        formValue.powe_diesel_nozzle = +this.managerNozzleData.powe_diesel_nozzle || 0;
      }
    } else if (this.loggedInRole === 'SUPER_ADMIN' || this.loggedInRole === 'admin') {
      formValue.role = 'PUMP_MANAGER';
    }

    this.use.signUp(formValue).subscribe(
      () => {
        this.notificationService.success('User Successfully Added');
        this.dialogRef.close({ isReload: true });
      },
      () => this.notificationService.failure('User add failed')
    );
  }

  // ✅ EDIT USER
  editUser(): void {
    if (!this.validateForm()) return;

    const formValue = this.userForm.value;
    const currentUserId = localStorage.getItem('userId');

    const updatedUser: any = {
      ...this.data,
      ...formValue
    };

    if (this.loggedInRole === 'PUMP_MANAGER' || this.loggedInRole === 'user') {

      if (this.isEditingSelf) {
        // ── SELF-EDIT: manager updating their own account ──
        // Role stays PUMP_MANAGER. Pump name + nozzles are freely editable.
        // Backend cascades firstName + nozzles to all employees automatically.
        updatedUser.role = 'PUMP_MANAGER';

      } else {
        // ── EMPLOYEE EDIT: manager updating one of their employees ──
        updatedUser.role = 'EMPLOYEE';
        updatedUser.managerId = currentUserId ? +currentUserId : null;
        const managerPumpId = localStorage.getItem('pumpId');
        updatedUser.pumpId = managerPumpId ? +managerPumpId : null;

        // Restore disabled firstName (locked — from manager's localStorage)
        if (this.isPumpNameAutoSet) {
          updatedUser.firstName = localStorage.getItem('firstName') || updatedUser.firstName;
        }
        // Restore auto-set nozzle values (disabled fields drop from formValue)
        if (this.isNozzleAutoSet && this.managerNozzleData) {
          updatedUser.petrol_nozzle      = +this.managerNozzleData.petrol_nozzle      || 0;
          updatedUser.diesel_nozzle      = +this.managerNozzleData.diesel_nozzle      || 0;
          updatedUser.xp_petrol_nozzle   = +this.managerNozzleData.xp_petrol_nozzle   || 0;
          updatedUser.powe_diesel_nozzle = +this.managerNozzleData.powe_diesel_nozzle  || 0;
        }
      }

    } else if (this.loggedInRole === 'SUPER_ADMIN' || this.loggedInRole === 'admin') {
      updatedUser.role = 'PUMP_MANAGER';
    }

    // 🔐 If password empty → do NOT send it
    if (!formValue.password) {
      delete updatedUser.password;
    }

    this.use.updateUser(updatedUser).subscribe(
      () => {
        if (this.isEditingSelf && formValue.firstName) {
          // Keep localStorage in sync so pump name reflects change immediately
          localStorage.setItem('firstName', formValue.firstName);
          this.notificationService.success('✅ Account updated — all employees synced automatically');
        } else {
          this.notificationService.success('User Successfully Updated');
        }
        this.dialogRef.close({ isReload: true });
      },
      () => this.notificationService.failure('Update failed')
    );
  }



  openChangePassword(): void {
    const loggedInId = localStorage.getItem('userId');
    const isSelf = String(this.data?.id) === String(loggedInId);
    this.dialog.open(ChangePasswordComponent, {
      width: '420px',
      panelClass: 'dialog-sm',
      disableClose: true,
      data: { 
        userId: this.data.id,
        isSelf: isSelf
      }
    });
  }

  // ✅ FIELD-LEVEL VALIDATION — shows specific message per missing field
  private validateForm(): boolean {
    this.userForm.markAllAsTouched();

    const v = this.userForm;
    const isAddMode = !this.data;

    // --- Required field definitions (label, controlName) ---
    const requiredFields: { label: string; key: string }[] = [
      ...(!this.isPumpNameAutoSet ? [{ label: 'Petrol Pump Name', key: 'firstName' }] : []),
      { label: 'Contact Name',      key: 'lastName'     },
      { label: 'Username',           key: 'username'     },
      ...(isAddMode               ? [{ label: 'Password',         key: 'password'     }] : []),
      { label: 'Phone Number',       key: 'phoneNumber'  },
      { label: 'Access Level / Role',key: 'role'         },
      { label: 'Email Address',      key: 'email'        },
    ];

    for (const field of requiredFields) {
      const ctrl = v.get(field.key);
      const val  = ctrl?.value;
      if (!val || (typeof val === 'string' && val.trim() === '')) {
        this.notificationService.failure(`⚠️ ${field.label} is required`);
        ctrl?.markAsTouched();
        return false;
      }
    }

    // --- Email format check ---
    const emailCtrl = v.get('email');
    if (emailCtrl?.errors?.['email']) {
      this.notificationService.failure('⚠️ Please enter a valid Email Address');
      return false;
    }

    // --- Phone number: digits only, min 10 digits ---
    const phone = v.get('phoneNumber')?.value?.toString().trim() || '';
    if (!/^\d{10,15}$/.test(phone)) {
      this.notificationService.failure('⚠️ Phone Number must be 10–15 digits');
      v.get('phoneNumber')?.markAsTouched();
      return false;
    }

    return true;
  }

  cancel(): void {
    this.dialogRef.close({ isReload: false });
  }
}

// export class AddUserComponent implements OnInit {

//   isReload: boolean;
//   userForm: FormGroup;
//   showPumpFields: boolean = true;

//   pumpOptions: number[] = Array.from({ length: 10 }, (_, i) => i + 0);
//   myForm: FormGroup;

//   constructor(
//     // private http: HttpClient,
//     private use: UserServiceService,
//     public dialogRef: MatDialogRef<AddUserComponent>,
//     private notificationService: NotificationService,
//     private fb: FormBuilder, 
//     @Inject(MAT_DIALOG_DATA) public data: any) {
//     console.log(data);
//   }

//   ngOnInit(): void {
//     this.userForm = this.fb.group({
//       firstName: ['', Validators.required],
//       lastName: ['', Validators.required],
//       username: ['', Validators.required],
//       password: ['', Validators.required],
//       phoneNumber: ['', Validators.required],
//       role: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       petrol_nozzle: [''],
//       diesel_nozzle: [''],
//       xp_petrol_nozzle: [''],
//       powe_diesel_nozzle: [''],
//     });
//     if (this.data) {
//       const formData = {
//         ...this.data,
//         petrol_nozzle: +this.data.petrol_nozzle,
//         diesel_nozzle: +this.data.diesel_nozzle,
//         xp_petrol_nozzle: +this.data.xp_petrol_nozzle,
//         powe_diesel_nozzle: +this.data.powe_diesel_nozzle,
//       };
//       this.userForm.patchValue(formData);
//     }
//     // this.showPumpFields = this.data.role !== 'admin';
//     this.userForm.get('role')?.valueChanges.subscribe(value => {
//       this.showPumpFields = value?.toLowerCase() !== 'admin';
//     });
  
//     // Initialize showPumpFields in case form is pre-filled
//     const initialRole = this.userForm.get('role')?.value;
//     this.showPumpFields = initialRole?.toLowerCase() !== 'admin';
//   }


//   addUser(): void {
//     if (this.userForm.invalid) {
//       this.notificationService.failure('Please fill out all required fields correctly.');
//       this.userForm.markAllAsTouched();
//       return;
//     }
    
//     this.use.signUp(this.userForm.value).subscribe(
//       response => {
//         if (response && response.id) {
//           this.notificationService.success('User Successfully Added.');
//           this.dialogRef.close({ 'isReload': this.isReload });
//         } else {
//           this.notificationService.failure('Unexpected response received.');
//         }
//       },
//       error => {
//         this.notificationService.failure('User was not added successfully.');
//       }
//     );
//   }

//   editUser() {
//     if (this.userForm.invalid) {
//       this.notificationService.failure('Please fill out all required fields correctly.');
//       this.userForm.markAllAsTouched();
//       return;
//     }
  
//     const updatedUser = {
//       ...this.data,
//       ...this.userForm.value
//     };
  
//     this.use.updateUser(updatedUser).subscribe(
//       response => {
//         console.log(response);
        
//         this.notificationService.success('User Successfully Updated.');
//         this.dialogRef.close({ 'isReload': true });
//       },
//       error => {
//         this.notificationService.failure('Failed to update user.');
//       }
//     );
//   }
//   cancel() {
//     this.dialogRef.close({ 'isReload': this.isReload });
//   }
// }
