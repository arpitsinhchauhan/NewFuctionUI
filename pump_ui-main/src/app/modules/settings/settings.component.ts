import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'app/services/notification.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  smtpHost = 'smtp.gmail.com';
  smtpPort = '587';
  senderEmail = 'system@pumpmanager.com';
  enableRegistration = true;
  backupSchedule = 'Daily';

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {}

  saveSettings() {
    this.notificationService.success('System settings saved successfully');
  }
}
