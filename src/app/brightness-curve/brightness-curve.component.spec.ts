import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrightnessCurveComponent } from './brightness-curve.component';

describe('BrightnessCurveComponent', () => {
  let component: BrightnessCurveComponent;
  let fixture: ComponentFixture<BrightnessCurveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrightnessCurveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrightnessCurveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
