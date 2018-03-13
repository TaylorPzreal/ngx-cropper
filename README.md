# ngx-cropper

An Angular5 image plugin, includes upload, cropper, save to server.

 [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

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
import 'ngx-cropper/dist/ngx-cropper.min.css';

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
import { NgxCropperOption } from 'ngx-cropper';

@component()
export class ExampleComponent {
  public ngxCropperConfig: NgxCropperOption;

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
      aspectRatio: 1 / 1, // default 1 / 1, for example: 16 / 9, 4 / 3 ...
      viewMode: 0 // default 0, value can be 0, 1, 2, 3
    };
  }

  // deal callback data
  public onReturnData(data: any) {
    // Do what you want to do
    console.warn(JSON.parse(data));


    //  Here has three type of messages now
    //  1. Max size
    // {
    //     code: 4000,
    //     data: null,
    //     msg: `The size is max than ${this.viewConfig.maxsize}, now size is ${currentSize}k`
    //  }

    //  2. Error
    //  {
    //       code: 4001,
    //       data: null,
    //       msg: 'ERROR: When sent to server, something wrong, please check the server url.'
    //  }

    //  3. Image type error
    // {
    //       code: 4002,
    //       data: null,
    //       msg: `The type you can upload is only image format`
    // }

    //  4. Success
    //  {
    //       code: 2000,
    //       data,
    //       msg: 'The image was sent to server successly'
    //  }
  }
}
```

## Development

> Welcome you join us and develop together, it's my honor you commit pull request.

```bash
git clone git@github.com:TaylorPzreal/ngx-cropper.git

npm run start # start developing

npm run build # start building prod packages
```
