import { getTestBed, TestBed} from '@angular/core/testing';
import { NgxCropperComponent } from './ngx-cropper.component';
import { By } from '@angular/platform-browser';
import { expect } from 'chai';
import { spy } from 'sinon';

window['describe']('ngx-cropper Test', () => {
  window['beforeEach'](() => {
    TestBed.configureTestingModule({
      declarations: [NgxCropperComponent]
    });
  });

  window['afterEach'](() => {
    getTestBed().resetTestingModule();
  });

  window['it']('should display', () => {
    const fixture = TestBed.createComponent(NgxCropperComponent);

    fixture.detectChanges();
    fixture.componentInstance.isShow = true;

    const h3 = fixture.debugElement.query(By.css('h3'));
    expect(h3.nativeElement.textContent).to.equal('Apply your image size and position');
  });

});
