import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
declare const $: any;

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  initialLoader = true;

  constructor(private spinnerService: NgxSpinnerService) { }

  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  display(value: boolean) {
    if (value) {
      this.spinnerService.show();
    } else {
      this.spinnerService.hide();
    }
    this.status.next(value);
  }
}
