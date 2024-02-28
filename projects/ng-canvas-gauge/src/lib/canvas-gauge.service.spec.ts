import { TestBed } from '@angular/core/testing';

import { CanvasGaugeService } from './canvas-gauge.service';

describe('CanvasGaugeService', () => {
  let service: CanvasGaugeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasGaugeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
