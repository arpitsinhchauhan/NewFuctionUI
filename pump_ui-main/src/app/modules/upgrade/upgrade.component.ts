import { Component, OnInit } from '@angular/core';
import { feedbackObject } from 'app/models/feedbackObject';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.css']
})
export class UpgradeComponent implements OnInit {

  msg: string | undefined;
  users: any;
  constructor(private user: UserServiceService,private notificationService:NotificationService) {
    // this.user.users().subscribe((data) => {
    //   this.users = data;
    // });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  currentRating: number = 0;

  rate(rating: number) {
    this.currentRating = rating;
  }

  getdata(data: feedbackObject) {
    if (data.username == '' || data.username == undefined) {
      this.notificationService.failure('username not set.');
      return;
    }
    if (data.email == '' || data.email == undefined) {
      this.notificationService.failure('email not set.');
      return;
    }
    if (data.message == '' || data.message == undefined) {
      this.notificationService.failure('message not set.');
      return;
    }
    data.rating = this.currentRating;
    this.user.feedback(data).subscribe((res) => { });
    console.info(data);
    if (data) {
      // this.notificationService.showNotification('Thanks user for your Feedback...');
      this.notificationService.failure('Thanks user for your Feedback...');
    }
    location.reload();
  }


}
