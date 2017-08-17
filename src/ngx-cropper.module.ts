import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { NgxCropperComponent } from './ngx-cropper.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  declarations: [
    NgxCropperComponent
  ],
  exports: [
    NgxCropperComponent
  ]
})

export class NgxCropperModule { }
