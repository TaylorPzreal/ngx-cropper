import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import 'cropperjs/dist/cropper.min.css';
import * as Cropper from 'cropperjs';

import { NgxCropperService } from './ngx-cropper.service';
import { Config } from './ngx-cropper.model';

@Component({
  selector: 'ngx-cropper',
  templateUrl: './ngx-cropper.component.html',
  styleUrls: ['./ngx-cropper.component.css'],
  providers: [NgxCropperService]
})
export class NgxCropperComponent implements OnInit {
  public isShow: boolean = false;
  public viewConfig: Config;
  @Input() private config: Config;
  @Output() private returnData: EventEmitter<string> = new EventEmitter<string>();

  private fileName: string;
  private fileType: string;
  private dom: HTMLInputElement;
  private cropper: Cropper;

  constructor(private ngxCropperService: NgxCropperService) { }

  public ngOnInit() {
    // init config
    this.viewConfig = {
      url: this.config.url || null,
      maxsize: this.config.maxsize || 512000,
      title: this.config.title || 'Apply your image size and position',
      uploadBtnName: this.config.uploadBtnName || 'Upload Image',
      uploadBtnClass: this.config.uploadBtnClass || null,
      cancelBtnName: this.config.cancelBtnName || 'Cancel',
      cancelBtnClass: this.config.cancelBtnClass || null,
      applyBtnName: this.config.applyBtnName || 'Apply',
      applyBtnClass: this.config.applyBtnClass || null,
      fdName: this.config.fdName || 'file',
      aspectRatio: this.config.aspectRatio || 1 / 1
    };

    //  init upload btn
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

  /**
   * click apply event
   *
   * @returns
   * @memberof NgxCropperComponent
   */
  public onApply() {
    const blob = this.dataURItoBlob(this.cropper.getCroppedCanvas().toDataURL(this.fileType));

    if (blob.size > this.viewConfig.maxsize) {
      const currentSize = Math.ceil(blob.size / 1024);
      // sent message max then size.
      this.returnData.emit(JSON.stringify({
        a: `The size is max than ${this.viewConfig.maxsize}, now size is ${currentSize}k`
      }));
      return;
    }

    const fd = new FormData();
    const name = this.viewConfig.fdName;
    fd.append(name, blob, this.fileName);

    const url = this.viewConfig.url;
    this.ngxCropperService.save(url, fd).subscribe(
      (data: any) => {
        // return success
        this.returnData.emit(JSON.stringify({
          b: 'The image was sent to server successly'
        }));
        // hidden modal
        this.onCancel();
      },
      (error: any) => {
        // return error
        this.returnData.emit(JSON.stringify({
          c: 'ERROR: When sent to server, something wrong, please check the server url.'
        }));
      }
    );
  }

  /**
   * Hidden edit modal
   *
   * @memberof NgxCropperComponent
   */
  public onCancel() {
    this.isShow = false;
  }

  /**
   * transfer uri to blob
   *
   * @private
   * @param {*} dataURI
   * @returns
   * @memberof NgxCropperComponent
   */
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

  /**
   * init cropper plugin
   *
   * @private
   * @memberof NgxCropperComponent
   */
  private initCropper(): void {
    console.warn(this.config);
    const cropBox = document.getElementById('cropper-image') as HTMLImageElement;

    this.cropper = new Cropper(cropBox, {
      aspectRatio: this.viewConfig.aspectRatio,
      autoCrop: true,
      viewMode: 1,
      dragMode: 'move',
      guides: true,
      movable: true,
      cropBoxMovable: false,
      cropBoxResizable: false
    });
  }
}
