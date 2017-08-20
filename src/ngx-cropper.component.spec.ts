import { getTestBed, TestBed} from '@angular/core/testing';
import { NgxCropperComponent } from './ngx-cropper.component';
import { By } from '@angular/platform-browser';
import { expect } from 'chai';
import { spy } from 'sinon';

describe('ngx-cropper Test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgxCropperComponent]
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
