import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'app/services/loader.service';

@Component({
  selector: 'app-loader-preview',
  templateUrl: './loader-preview.component.html',
  styleUrls: ['./loader-preview.component.scss']
})
export class LoaderPreviewComponent implements OnInit {

  constructor(private loaderService: LoaderService) { }

  ngOnInit(): void {
  }

  setLoader(option: number) {
    // Show the loader for 3 seconds so the user can see the "real" output
    this.loaderService.display(true);
    setTimeout(() => {
      this.loaderService.display(false);
    }, 3000);
  }

}
