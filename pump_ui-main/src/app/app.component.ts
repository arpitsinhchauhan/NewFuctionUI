import { trigger, transition, style, animate } from '@angular/animations';
import { Component} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('loaderInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class AppComponent {
  // showLoader = false;
  typeSelected = 'ball-spin-clockwise';
  color = 'rgba(0, 0, 0, 0.8)';
}
