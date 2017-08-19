# ngx-cropper

An Angular2 &amp; Angular4 image plugin, includes upload, cropper, save to server.

---

## Example

![Example](./example.png)

## Usage

### 1. Install

```bash
  npm i -S ngx-cropper
```

### 2. Config __example.module.ts__

```typescript
import { NgxCropperModule } from 'ngx-cropper';

@NgModule({
  imports: [
    NgxCropperModule
  ]
})
```

### 3. Config __example.component.html__

```html
  <ngx-cropper [config]="ngxCropperConfig" (returnData)="onReturnData($event)"></ngx-cropper>
```

### 4. Config __example.component.ts__

```typescript
@component()
export class ExampleComponent {
  public ngxCropperConfig: object;

  constructor() {
    this.ngxCropperConfig = {
      url: null, // image server url
      maxsize: 512000, // image max size, default 500k = 512000bit
      title: 'Apply your image size and position', // edit modal title, this is default
      uploadBtnName: 'Upload Image', // default Upload Image
      uploadBtnClass: null, // default bootstrap styles, btn btn-primary
      cancelBtnName: 'Cancel', // default Cancel
      cancelBtnClass: null, // default bootstrap styles, btn btn-default
      applyBtnName: 'Apply', // default Apply
      applyBtnClass: null, // default bootstrap styles, btn btn-primary
      fdName: 'file', // default 'file', this is  Content-Disposition: form-data; name="file"; filename="fire.jpg"
      aspectRatio: 1 / 1// default 1 / 1, for example: 16 / 9, 4 / 3 ...
    }
  }

  // deal callback data
  public onReturnData(data: any) {
    // do you want to do
    console.warn(JSON.parse(data));
    //  Here has three type of messages now
    //  a: `The size is max than ${this.viewConfig.maxsize}, now size is ${currentSize}k`
    //  b: 'The image was sent to server successly'
    //  c: ERROR: When sent to server, something wrong, please check the server url.'
  }
}
```
