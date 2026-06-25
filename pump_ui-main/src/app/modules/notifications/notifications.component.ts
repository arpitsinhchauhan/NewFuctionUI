import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserServiceService } from 'app/services/user-service.service';
import { API_UPLOAD } from 'app/serviceult';
declare var $: any;
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  imageUrls: string[] = [];
  selectedFiles: File[] = [];
  images: string[] = [];
  imagesData: any[] = [];
  sanitizer: any;

  constructor(private http: HttpClient, private imageService: UserServiceService) { }

  imgSrc: string;
  onClick(event) {
    const imgElem = event.target;
    var target = event.target || event.srcElement || event.currentTarget;
    var srcAttr = target.attributes.src;
    this.imgSrc = srcAttr.nodeValue;
  }
  ngOnInit(): void {
    this.imageService.getImageUrls().subscribe((data) => {
      this.imageUrls = data;

    });

    // this.imageService.getAllImages().subscribe(res => {
    //   this.images = res[0].images as ImageEntity[];
    //   (this.images);
    //   if (this.images) {
    //     this.images.forEach(element => {
    //       let objectURL = 'data:image/jpeg;base64,' + this.bin2string(element.imageUrl);
    //       this.imagesData.push(this.sanitizer.bypassSecurityTrustResourceUrl(objectURL));
    //     })
    //   }
    // }, error => {
    //   (error);
    // });
  }

  imageData(imageData: any) {
    throw new Error('Method not implemented.');
  }
  bin2string(imgData: any) {
    throw new Error('Method not implemented.');
  }


  onFileSelected(event: any) {
    const files: FileList = event.target.files;

    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrls.push(e.target.result as string);
      };
      reader.readAsDataURL(files[i]);
      alert("Img Upload");
    }
  }

  onSubmit(event: any) {
    event.preventDefault();
    if (this.selectedFiles.length === 0) {
      console.error("No files selected.");
      return;
    }
  
    const formData: FormData = new FormData();
  
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const file: File = this.selectedFiles[i];
      formData.append('file', file, file.name); // Use 'file' as the key
    }
  
    this.http.post(API_UPLOAD, formData)
      .subscribe(
        (response) => {
          // Handle the response from the server if needed
          alert('View Images......');
        },
        (error) => {
          console.error('Error uploading files:', error);
          // Handle errors if necessary
        }
      );
  }


}