import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

import Cropper, { CropperOptions} from 'cropperjs';

import { NgxCropperService } from './ngx-cropper.service';
import { NgxCropperOption } from './ngx-cropper.model';

@Component({
  selector: 'ngx-cropper',
  template: `
    <section class="inline-block">
      <button class="btn btn-primary" [ngClass]="viewConfig.uploadBtnClass"
      (click)="inputImage.nativeElement.click()">{{viewConfig.uploadBtnName}}</button>
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
  public viewConfig!: NgxCropperOption;
  @Input() public config!: NgxCropperOption;
  @Output() public returnData: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('inputImage', { static: false }) inputImage!: ElementRef<HTMLInputElement>;

  private fileName: string = '';
  private fileType: string = '';
  private cropper: Cropper | null = null;

  constructor(private ngxCropperService: NgxCropperService) {}

  public ngOnInit(): void {
    // init config
    this.viewConfig = {
      url: this.config?.url ?? null,
      maxsize: this.config?.maxsize ?? 512000,
      title: this.config?.title ?? 'Apply your image size and position',
      uploadBtnName: this.config?.uploadBtnName ?? 'Upload Image',
      uploadBtnClass: this.config?.uploadBtnClass ?? null,
      cancelBtnName: this.config?.cancelBtnName ?? 'Cancel',
      cancelBtnClass: this.config?.cancelBtnClass ?? null,
      applyBtnName: this.config?.applyBtnName ?? 'Apply',
      applyBtnClass: this.config?.applyBtnClass ?? null,
      errorMsgs: this.config?.errorMsgs ?? {},
      fdName: this.config?.fdName ?? 'file',
      aspectRatio: this.config?.aspectRatio ?? 1 / 1,
      viewMode: this.config?.viewMode ?? 0
    };
  }

  public ngAfterViewInit(): void {
    //  init upload btn, after dom content loaded init down.
    setTimeout(() => {
      this.inputImage.nativeElement.onchange = () => {
        const files = this.inputImage.nativeElement.files;

        if (files && files.length > 0) {
          this.isShow = true;

          setTimeout(() => {
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

            // Destroy existing cropper if it exists
            if (this.cropper) {
              this.cropper.destroy();
            }

            // Initialize cropper with new image
            this.initCropper(blobURL);
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
  public onApply(): void {
    if (!this.cropper) {
      return;
    }
    
    this.applying = true;
    const cropperCanvas = this.cropper.getCropperCanvas();
    if (!cropperCanvas) {
      this.applying = false;
      return;
    }
    // In cropperjs 2.x, getCropperCanvas returns a CropperCanvas object
    // We need to access the canvas element from it
    // Handle both cases: direct canvas element or CropperCanvas object with canvas property
    const canvas = (cropperCanvas instanceof HTMLCanvasElement) 
      ? cropperCanvas 
      : (cropperCanvas as any).canvas || cropperCanvas;
    if (!canvas || typeof canvas.toDataURL !== 'function') {
      this.applying = false;
      return;
    }
    const blob = this.dataURItoBlob(canvas.toDataURL(this.fileType));

    if (blob.size > (this.viewConfig?.maxsize ?? 0)) {
      const currentSize = Math.ceil(blob.size / 1024);
      // sent message max then size.
      this.returnData.emit(
        JSON.stringify({
          code: 4000,
          data: currentSize,
          msg: `Max size allowed is ${this.viewConfig?.maxsize ?? 0 / 1024}kb, current size is ${currentSize}kb`
        })
      );
      this.error =
        this.viewConfig.errorMsgs?.['4000'] ?? `Max size allowed is ${this.viewConfig?.maxsize ?? 0 / 1024}kb, Current size is ${currentSize}kb`;
      this.applying = false;
      return;
    }

    const fd = new FormData();
    const name = this.viewConfig?.fdName ?? '';
    fd.append(name, blob, this.fileName);

    const url = this.viewConfig.url;
    if (!url) {
      this.returnData.emit(
        JSON.stringify({
          code: 4001,
          data: null,
          msg: 'ERROR: Server URL is not configured.'
        })
      );
      this.error = this.viewConfig.errorMsgs?.['4001'] ?? 'When sent to the server, something went wrong';
      this.applying = false;
      return;
    }
    
    this.ngxCropperService.save(url, fd).subscribe({
      next: (data: any) => {
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
      error: () => {
        // return error
        this.returnData.emit(
          JSON.stringify({
            code: 4001,
            data: null,
            msg: 'ERROR: When sent to the server, something went wrong, please check the server url.'
          })
        );
        this.error = this.viewConfig.errorMsgs?.['4001'] ?? 'When sent to the server, something went wrong';
        this.applying = false;
      }
    });
  }

  /**
   * Hidden edit modal
   *
   * @memberof NgxCropperComponent
   */
  public onCancel(): void {
    this.error = '';
    this.isShow = false;
    this.applying = false;
    this.inputImage.nativeElement.value = '';
    
    // Destroy cropper instance when canceling
    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = null;
    }
  }

  /**
   * transfer uri to blob
   *
   * @private
   * @param {*} dataURI
   * @returns
   * @memberof NgxCropperComponent
   */
  private dataURItoBlob(dataURI: string): Blob {
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
   * @param {string} [imageSrc] - Optional image source URL
   * @memberof NgxCropperComponent
   */
  private initCropper(imageSrc?: string): void {
    const cropBox = document.getElementById('cropper-image') as HTMLImageElement;
    
    // Set image source if provided
    if (imageSrc) {
      cropBox.src = imageSrc;
    }
    
    // enum DragMode {
    //   Crop = 'crop',
    //   Move = 'move',
    //   None = 'none',
    // }

    const options: CropperOptions = {
      // aspectRatio: this.viewConfig.aspectRatio,
      // autoCrop: true,
      // viewMode: this.viewConfig.viewMode || 0,
      // dragMode: DragMode.Move,
      // cropBoxMovable: false,
      // cropBoxResizable: false
    };

    this.cropper = new Cropper(cropBox, options);
  }
}
