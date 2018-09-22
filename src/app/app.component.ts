import { Component, OnInit } from '@angular/core';
import { CropperOption } from 'cropper';

@Component({
  selector: 'ws-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public cropperConfig: CropperOption;
  title = 'ngx-cropper-workspace';
  constructor() {}

  ngOnInit() {
    this.cropperConfig = {
      url: 'http://localhost:3000/images',
      title: 'Apply your image size and position',
      maxsize: 512000, // default 500k,
    };
  }

  public onReturnData(data: any) {
    console.warn(JSON.parse(data));
  }
}
