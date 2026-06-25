import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoaderService } from 'app/services/loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-petrol-loader',
  templateUrl: './petrol-loader.component.html',
  styleUrls: ['./petrol-loader.component.scss']
})
export class PetrolLoaderComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  private loaderSubscription: Subscription;

  constructor(private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.loaderSubscription = this.loaderService.status.subscribe((status: boolean) => {
      this.isLoading = status;
    });
  }

  ngOnDestroy(): void {
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
  }

}
