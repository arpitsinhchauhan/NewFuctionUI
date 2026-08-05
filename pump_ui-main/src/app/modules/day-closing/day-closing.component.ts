import { Component, OnInit } from '@angular/core';
import { UserServiceService } from 'app/services/user-service.service';
import { NotificationService } from 'app/services/notification.service';

@Component({
  selector: 'app-day-closing',
  templateUrl: './day-closing.component.html',
  styleUrls: ['./day-closing.component.scss']
})
export class DayClosingComponent implements OnInit {

  businessDate: Date = new Date();
  userId: string = localStorage.getItem('userId') || '';
  username: string = localStorage.getItem('username') || localStorage.getItem('firstName') || 'Manager';
  userRole: string = localStorage.getItem('role') || 'EMPLOYEE';

  eodStatus: string = 'OPEN';
  isClosed: boolean = false;
  closedBy: string = '';
  closedTime: string = '';
  reopenedBy: string = '';
  reopenedTime: string = '';
  reopenReason: string = '';

  openingCash: number = 0;
  eodDetails: any = null;
  consolidatedData: any = null;
  validationChecks: any[] = [];
  canClose: boolean = false;

  auditLogs: any[] = [];
  showConfirmModal: boolean = false;
  showReopenModal: boolean = false;
  adminReopenReason: string = '';

  get isAuthorized(): boolean {
    const role = (this.userRole || '').toLowerCase();
    return role.includes('admin') || role.includes('owner') || role.includes('manager') || role === 'user';
  }

  get isAdmin(): boolean {
    const role = (this.userRole || '').toLowerCase();
    return role.includes('admin') || role.includes('superadmin') || role.includes('owner');
  }

  constructor(
    private userService: UserServiceService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadEodData();
  }

  onDateChange() {
    this.loadEodData();
  }

  loadEodData() {
    if (!this.businessDate || !this.userId) return;
    const formattedDate = this.userService.getFormattedDate(this.businessDate);

    // Fetch EOD status
    this.userService.getEodStatus(formattedDate, this.userId).subscribe(res => {
      if (res && res.success) {
        this.eodStatus = res.status;
        this.isClosed = res.isClosed;
        this.closedBy = res.closedBy || '';
        this.closedTime = res.closedTime || '';
        this.reopenedBy = res.reopenedBy || '';
        this.reopenedTime = res.reopenedTime || '';
        this.reopenReason = res.reopenReason || '';
        this.eodDetails = res.details || null;
        if (this.eodDetails && this.eodDetails.openingCash) {
          this.openingCash = this.eodDetails.openingCash;
        }
      }
    });

    // Fetch pre-closing validation checks
    this.userService.validateEod(formattedDate, this.userId).subscribe(res => {
      if (res) {
        this.canClose = res.canClose;
        this.validationChecks = res.checks || [];
      }
    });

    // Fetch consolidated daily data
    this.userService.getDailyConsolidatedReport(formattedDate, this.userId).subscribe(res => {
      if (res && res.success) {
        this.consolidatedData = res;
      }
    });

    // Fetch EOD Audit Logs
    this.userService.getEodAuditLogs(formattedDate, this.userId).subscribe(res => {
      if (res) {
        this.auditLogs = res;
      }
    });
  }

  openConfirmModal() {
    if (!this.canClose && !this.isClosed) {
      this.notificationService.failure("Cannot perform Day Closing. Please resolve validation errors first.");
      return;
    }
    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
  }

  executeCloseDay() {
    const formattedDate = this.userService.getFormattedDate(this.businessDate);
    const payload = {
      businessDate: formattedDate,
      userId: this.userId,
      username: this.username,
      openingCash: this.openingCash
    };

    this.userService.closeDay(payload).subscribe({
      next: (res: any) => {
        this.showConfirmModal = false;
        this.notificationService.success("🔒 Day Closing completed successfully for " + formattedDate);
        this.loadEodData();
      },
      error: (err: any) => {
        this.notificationService.failure("Failed to complete Day Closing: " + (err.error?.message || err.message));
      }
    });
  }

  openReopenModal() {
    if (!this.isAdmin) {
      this.notificationService.failure("Only Admin / Owner can reopen a closed business day.");
      return;
    }
    this.adminReopenReason = '';
    this.showReopenModal = true;
  }

  closeReopenModal() {
    this.showReopenModal = false;
  }

  executeReopenDay() {
    if (!this.adminReopenReason || !this.adminReopenReason.trim()) {
      this.notificationService.failure("Mandatory: Please provide a reason for reopening this business date.");
      return;
    }

    const formattedDate = this.userService.getFormattedDate(this.businessDate);
    const payload = {
      businessDate: formattedDate,
      userId: this.userId,
      adminUsername: this.username,
      reason: this.adminReopenReason.trim()
    };

    this.userService.reopenDay(payload).subscribe({
      next: (res: any) => {
        this.showReopenModal = false;
        this.notificationService.success("🔓 Business Day " + formattedDate + " unlocked and reopened successfully.");
        this.loadEodData();
      },
      error: (err: any) => {
        this.notificationService.failure("Failed to reopen day: " + (err.error?.message || err.message));
      }
    });
  }

  printReport() {
    window.print();
  }

  exportExcel() {
    this.notificationService.success("Exporting Day Closing report to Excel...");
    // Trigger standard table export
  }

  exportPdf() {
    this.notificationService.success("Exporting Day Closing report to PDF...");
  }
}
