import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ChartModule } from 'primeng/chart';

import { UploadModule } from '../uploader/upload.module';

import { BrightnessCurveComponent } from './brightness-curve.component';
import { BrightnessCurveChartComponent } from './chart/chart.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    InputNumberModule,
    ButtonModule,
    SplitButtonModule,
    SliderModule,
    ColorPickerModule,
    ProgressSpinnerModule,
    ToggleButtonModule,
    ChartModule,
    UploadModule
  ],
  declarations: [BrightnessCurveComponent, BrightnessCurveChartComponent],
  exports: [BrightnessCurveComponent, BrightnessCurveChartComponent]
})
export class BrightnessCurveModule { }
