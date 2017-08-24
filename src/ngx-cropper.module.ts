import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxCropperComponent } from './ngx-cropper.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    NgxCropperComponent
  ],
  exports: [
    NgxCropperComponent
  ]
})

export class NgxCropperModule { }
