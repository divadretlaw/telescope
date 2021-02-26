import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrightnessCurveChartComponent } from './brightness-curve-chart.component';

describe('BrightnessCurveChartComponent', () => {
  let component: BrightnessCurveChartComponent;
  let fixture: ComponentFixture<BrightnessCurveChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrightnessCurveChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrightnessCurveChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
