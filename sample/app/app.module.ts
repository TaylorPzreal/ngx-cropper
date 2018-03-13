import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import '../../dist/ngx-cropper.min.css';
import { NgxCropperModule } from '../../dist';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    NgxCropperModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
