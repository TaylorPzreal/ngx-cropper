import { Component } from '@angular/core';

@Component({
  selector: 'ngx-app',
  templateUrl: './app.component.html'
})

export class AppComponent {
  public ngxCropperConfig: object;

  constructor() {
    console.warn('test');
    this.ngxCropperConfig = {
      url: 'http://localhost:3000/images',
      title: 'Apply your image size and position',
      maxsize: 512000, // default 500k,
    };
  }

  public onReturnData(data: any) {
    console.warn(JSON.parse(data));
  }
}
