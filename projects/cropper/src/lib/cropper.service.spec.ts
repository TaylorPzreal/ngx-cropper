import { TestBed } from '@angular/core/testing';

import { CropperService } from './cropper.service';

describe('CropperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CropperService = TestBed.get(CropperService);
    expect(service).toBeTruthy();
  });
});
