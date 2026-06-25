import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-custom-pdf-viewer',
  templateUrl: './custom-pdf-viewer.component.html',
  styleUrls: ['./custom-pdf-viewer.component.css']
})
export class CustomPdfViewerComponent implements OnInit {

  src: any;
  title;
  zoom_to = 1;

  @ViewChild(CustomPdfViewerComponent) private pdfComponent: CustomPdfViewerComponent | undefined;
  searchText = '';
  pdfFindController: any;
  data: any;
  selectedDate: any;

  constructor(public dialogRef: MatDialogRef<CustomPdfViewerComponent>,
    @Inject(MAT_DIALOG_DATA) data: any, private spinnerService: NgxSpinnerService) {
    this.pdfDocumentSrc = data.pdfData;
    this.title = data.title;
    this.selectedDate = data.selectedDate;
    setTimeout(() => {
      // this.loaderService.display(false);
    }, 1000);
  }

  applyFilter(event: string, findPrevious?: boolean | undefined) {
    (event);
    const filterValue = event;
    if (this.pdfComponent) {
      if (this.searchText !== filterValue) {
        this.searchText = filterValue;

        this.pdfComponent.pdfFindController.executeCommand('find', {
          query: this.searchText,
          highlightAll: true
        });
      } else {
        this.searchText = filterValue;
        this.pdfComponent.pdfFindController.executeCommand('findagain', {
          query: this.searchText,
          highlightAll: true,
          findPrevious: findPrevious ? this.searchText : undefined
        });
      }
    }
  }


  onKeyDownHandler(event: { target: { value: string; }; }) {
    this.applyFilter(event.target.value);
  }

  onDescClick() {
    this.applyFilter(this.searchText);
  }

  onAscClick() {
    this.applyFilter(this.searchText, true);
  }

  onInputChange(event: { target: { value: string; }; }) {
    this.applyFilter(event.target.value);
  }

  pdfDocumentSrc: any;
  page: number = 1;
  totalPages: number = 0;
  isLoaded: boolean = false;

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

  zoom_in() {
    this.zoom_to = this.zoom_to + 0.25;
  }

  zoom_out() {
    if (this.zoom_to > 0.25) {
      this.zoom_to = this.zoom_to - 0.25;
    }
  }
  // downloadPDF() {

  //   // Construct the API URL with the selected date
  //   const apiUrl = `http://localhost:9090/api/bill?date=${this.selectedDate}`;

  //   // Make a GET request to the API endpoint to download the PDF
  //   fetch(apiUrl, {
  //     method: 'GET',
  //   })
  //     .then(response => {
  //       // Check if the response is successful
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.blob(); // Extract the binary data from the response
  //     })
  //     .then(blob => {
  //       // Create a blob URL for the PDF
  //       const url = window.URL.createObjectURL(blob);

  //       // Create a temporary <a> element to trigger the download
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = `${this.selectedDate}.pdf`; // Set filename with date
  //       document.body.appendChild(a);
  //       a.click();

  //       // Clean up by revoking the blob URL and removing the <a> element
  //       window.URL.revokeObjectURL(url);
  //       document.body.removeChild(a);
  //     })
  //     .catch(error => {
  //       // Handle any errors
  //       console.error('Error downloading PDF:', error);
  //     });
  // }

}

