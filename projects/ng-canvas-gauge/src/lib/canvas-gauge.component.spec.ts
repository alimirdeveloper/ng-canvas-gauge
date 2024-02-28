import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasGaugeComponent } from './canvas-gauge.component';

describe('CanvasGaugeComponent', () => {
  let component: CanvasGaugeComponent;
  let fixture: ComponentFixture<CanvasGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasGaugeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CanvasGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
