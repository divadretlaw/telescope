import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app.routing';

// MAKR: - PrimeNG
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// MARK: - AppComponents
import { AppComponent } from './app.component';
import { BrightnessCurveComponent } from './brightness-curve/brightness-curve.component';
import { ErrorComponent } from './error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    BrightnessCurveComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FileUploadModule,
    InputNumberModule,
    ButtonModule,
    SplitButtonModule,
    SliderModule,
    ColorPickerModule,
    ProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
