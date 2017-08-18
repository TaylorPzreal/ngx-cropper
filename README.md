# ngx-cropper
An Angular2 &amp; Angular4 image plugin, includes upload, cropper, save to server.

## Example
![Example](./example.png)

## Usage
1. ExampleModule
```ts
import { NgxCropperModule } from 'ngx-cropper';

@NgModule({
  imports: [
    NgxCropperModule
  ]
})
```

2. ExampleComponentHtml
```html
  <ngx-cropper [config]="ngxCropperConfig" (returnData)="onReturnData($event)"></ngx-cropper>
```

3. ExampleComponent
```ts
@component()
export class ExampleComponent {
  public ngxCropperConfig: object;

  constructor() {
    this.ngxCropperConfig = {
      url: '', //  image server url
    }
  }

  // deal callback data
  public onReturnData(data: any) {
    // do you want to do
  }
}
```
