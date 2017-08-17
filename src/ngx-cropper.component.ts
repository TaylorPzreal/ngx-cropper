import { Component } from '@angular/core';

import 'cropperjs/dist/cropperjs.min.css';
import * as Cropper from 'cropperjs';

@Component({
  selector: 'ngx-cropper',
  templateUrl: './ngx-cropper.component.html',
  styleUrls: ['./ngx-cropper.component.css']
})
export class NgxCropperComponent {
  constructor() {
    console.warn('ngx-cropper');
  }
}
