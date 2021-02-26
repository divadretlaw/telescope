import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { ChartModule } from 'primeng/chart';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { BrightnessCurveChartComponent } from './brightness-curve-chart.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ChartModule,
    ColorPickerModule,
    ButtonModule,
    SplitButtonModule,
    ToggleButtonModule
  ],
  declarations: [BrightnessCurveChartComponent],
  exports: [BrightnessCurveChartComponent]
})
export class BrightnessCurveChartModule {}
