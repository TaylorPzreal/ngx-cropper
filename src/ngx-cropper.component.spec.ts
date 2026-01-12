import { getTestBed, TestBed } from '@angular/core/testing';
import { NgxCropperComponent } from './ngx-cropper.component';
import { By } from '@angular/platform-browser';
import { expect } from 'chai';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxCropperModule } from './ngx-cropper.module';

declare const describe: any;
declare const beforeEach: any;
declare const afterEach: any;
declare const it: any;

describe('ngx-cropper Test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        HttpClientModule,
        NgxCropperModule
      ]
    });
  });

  afterEach(() => {
    getTestBed().resetTestingModule();
  });

  it('should display', () => {
    const fixture = TestBed.createComponent(NgxCropperComponent);

    fixture.detectChanges();
    fixture.componentInstance.isShow = true;

    const h3 = fixture.debugElement.query(By.css('h3'));
    expect(h3.nativeElement.textContent).to.equal('Apply your image size and position');
  });

});
