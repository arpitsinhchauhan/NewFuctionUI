import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'app/services/notification.service';

@Component({
  selector: 'app-database-management',
  templateUrl: './database-management.component.html',
  styleUrls: ['./database-management.component.css']
})
export class DatabaseManagementComponent implements OnInit {
  databases: any[] = [];
  currentPage = 1;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadDatabases();
  }

  loadDatabases() {
    this.databases = [
      { id: 1, name: 'pumpmanager1_db', status: 'Connected', size: '45 MB', tables: 32, lastBackup: '2026-06-24 08:00 AM' },
      { id: 2, name: 'pumpmanager2_db', status: 'Connected', size: '28 MB', tables: 32, lastBackup: '2026-06-24 08:00 AM' },
      { id: 3, name: 'ecofuel_db', status: 'Initializing', size: '0 MB', tables: 0, lastBackup: 'N/A' },
      { id: 4, name: 'master_db', status: 'Connected', size: '12 MB', tables: 8, lastBackup: '2026-06-24 06:00 AM' }
    ];
  }

  backupDb(dbName: string) {
    this.notificationService.success(`Backup created successfully for ${dbName}`);
  }

  optimizeDb(dbName: string) {
    this.notificationService.success(`Database ${dbName} optimized successfully`);
  }
}
