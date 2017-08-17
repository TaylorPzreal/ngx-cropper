import { Component, OnInit } from '@angular/core';

import 'cropperjs/dist/cropper.min.css';
import * as Cropper from 'cropperjs';

import { NgxCropperService } from './ngx-cropper.service';

@Component({
  selector: 'ngx-cropper',
  templateUrl: './ngx-cropper.component.html',
  styleUrls: ['./ngx-cropper.component.css'],
  providers: [NgxCropperService ]
})
export class NgxCropperComponent implements OnInit {
  // define styles,url,filename,name
  public isShow: boolean = false;

  private fileName: string;
  private fileType: string;
  private dom: HTMLInputElement;
  private cropper: Cropper;

  private stateMsg = {
    maxSize: { a: 'The size is max than 500k.' },
    success: { b: 'The image was sent to server successly' },
    error: { c: 'The image was sent to server error' }
  };

  constructor(private ngxCropperService: NgxCropperService) { }

  public ngOnInit() {
    const dom = (this.dom = document.getElementById('inputImage') as HTMLInputElement);
    this.dom.onchange = () => {
      const files = dom.files;

      if (files && files.length > 0) {
        this.isShow = true;

        setTimeout(() => {
          this.initCropper();

          const file = files[0];
          const blobURL = URL.createObjectURL(file);
          this.fileName = file.name;
          this.fileType = file.type;

          this.cropper.replace(blobURL);
        });
      }
    };
  }

  public onApply() {
    const blob = this.dataURItoBlob(this.cropper.getCroppedCanvas().toDataURL(this.fileType));

    if (blob.size > 512000) {
      const currentSIze = Math.ceil(blob.size / 1024);
      // sent message max then size.
      return;
    }

    const fd = new FormData();
    const name = 'file';

    fd.append(name, blob, this.fileName);

    const url = '';
    this.ngxCropperService.save(url, fd).subscribe((data: any) => {
      // return success
    }, (error: any) => {
      // return error
    });
  }

  public onCancel() {
    this.isShow = false;
  }

  private dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI.split(',')[1]);

    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const bb = new Blob([ab], {
      type: mimeString
    });
    return bb;
  }

  private initCropper(): void {
    const cropBox = document.getElementById('cropper-image') as HTMLImageElement;

    this.cropper = new Cropper(cropBox, {
      aspectRatio: 1 / 1,
      autoCrop: true,
      viewMode: 1,
      dragMode: 'move',
      guides: true,
      movable: true,
      cropBoxMovable: false,
      cropBoxResizable: false
      // background: false
    });
  }
}
