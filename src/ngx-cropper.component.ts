import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';

import Cropper from 'cropperjs';

import { NgxCropperService } from './ngx-cropper.service';
import { NgxCropperOption } from './ngx-cropper.model';

@Component({
  selector: 'ngx-cropper',
  template: `
    <section class="inline-block">
      <button class="btn btn-primary" [ngClass]="viewConfig.uploadBtnClass"
      (click)="inputImage.click()">{{viewConfig.uploadBtnName}}</button>
      <input #inputImage type="file" class="hide" hidden>
    </section>
    <section class="crop-container" *ngIf="isShow === true">
      <div class="crop-box">
        <div class="crop-box-header">
          <h3>{{viewConfig.title}}</h3>
          <button type="button" class="crop-box-close" (click)="onCancel()">
            <span></span>
          </button>
        </div>
        <div class="crop-box-body">
          <figure style="height: 300px;">
            <img id="cropper-image" class="full-width">
          </figure>
        </div>
        <div *ngIf="error.length > 0" class="crop-box-error">{{ error }}</div>
        <div class="crop-box-footer">
          <button class="btn btn-default"
          [ngClass]="viewConfig.cancelBtnClass"  (click)="onCancel()">{{viewConfig.cancelBtnName}}</button>
          <button class="btn btn-primary" [disabled]="applying"
          [ngClass]="viewConfig.applyBtnClass"  (click)="onApply()">{{viewConfig.applyBtnName}}</button>
        </div>
      </div>
    </section>
  `,
  providers: [NgxCropperService]
})
export class NgxCropperComponent implements OnInit, AfterViewInit {
  public error: string = '';
  public isShow: boolean = false;
  public applying: boolean = false;
  public viewConfig: NgxCropperOption;
  @Input() private config: NgxCropperOption;
  @Output() private returnData: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('inputImage') inputImage: any;

  private fileName: string;
  private fileType: string;
  private cropper: Cropper;

  constructor(private ngxCropperService: NgxCropperService) {}

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
      errorMsgs: this.config.errorMsgs || {},
      fdName: this.config.fdName || 'file',
      aspectRatio: this.config.aspectRatio || 1 / 1,
      viewMode: this.config.viewMode || 0
    };
  }

  public ngAfterViewInit() {
    //  init upload btn, after dom content loaded init down.
    setTimeout(() => {
      this.inputImage.nativeElement.onchange = () => {
        const files = this.inputImage.nativeElement.files;

        if (files && files.length > 0) {
          this.isShow = true;

          setTimeout(() => {
            this.initCropper();

            const file = files[0];

            // Only can upload image format.
            if (!/^(image\/*)/.test(file.type)) {
              this.returnData.emit(
                JSON.stringify({
                  code: 4002,
                  data: null,
                  msg: `The type you can upload is only image format`
                })
              );
              this.isShow = false;
              return;
            }

            const blobURL = URL.createObjectURL(file);
            this.fileName = file.name;
            this.fileType = file.type;

            this.cropper.replace(blobURL);
          });
        }
      };
    }, 0);
  }

  /**
   * click apply event
   *
   * @returns
   * @memberof NgxCropperComponent
   */
  public onApply() {
    this.applying = true;
    const blob = this.dataURItoBlob(this.cropper.getCroppedCanvas().toDataURL(this.fileType));

    if (blob.size > this.viewConfig.maxsize) {
      const currentSize = Math.ceil(blob.size / 1024);
      // sent message max then size.
      this.returnData.emit(
        JSON.stringify({
          code: 4000,
          data: currentSize,
          msg: `Max size allowed is ${this.viewConfig.maxsize / 1024}kb, current size is ${currentSize}kb`
        })
      );
      this.error =
        this.viewConfig.errorMsgs['4000'] || `Max size allowed is ${this.viewConfig.maxsize / 1024}kb, Current size is ${currentSize}kb`;
      this.applying = false;
      return;
    }

    const fd = new FormData();
    const name = this.viewConfig.fdName;
    fd.append(name, blob, this.fileName);

    const url = this.viewConfig.url;
    this.ngxCropperService.save(url, fd).subscribe(
      (data: any) => {
        // return success
        this.returnData.emit(
          JSON.stringify({
            code: 2000,
            data,
            msg: 'The image was sent to the server successfully'
          })
        );
        // hidden modal
        this.onCancel();
      },
      (error: any) => {
        // return error
        this.returnData.emit(
          JSON.stringify({
            code: 4001,
            data: null,
            msg: 'ERROR: When sent to the server, something went wrong, please check the server url.'
          })
        );
        this.error = this.viewConfig.errorMsgs['4001'] || 'When sent to the server, something went wrong';
        this.applying = false;
      }
    );
  }

  /**
   * Hidden edit modal
   *
   * @memberof NgxCropperComponent
   */
  public onCancel() {
    this.error = '';
    this.isShow = false;
    this.applying = false;
    this.inputImage.nativeElement.value = '';
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
    const mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];

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
    const cropBox = document.getElementById('cropper-image') as HTMLImageElement;
    enum DragMode {
      Crop = 'crop',
      Move = 'move',
      None = 'none',
    }

    const options: Cropper.Options = {
      aspectRatio: this.viewConfig.aspectRatio,
      autoCrop: true,
      viewMode: this.viewConfig.viewMode || 0,
      dragMode: DragMode.Move,
      cropBoxMovable: false,
      cropBoxResizable: false
    };

    this.cropper = new Cropper(cropBox, options);
  }
}
