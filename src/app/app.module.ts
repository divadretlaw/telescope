import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app.routing';
import { AppState } from './app.state';

// MARK: - PrimeNG
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// MARK: - App Components
import { AppComponent } from './app.component';
import { BrightnessCurveComponent } from './brightness-curve/brightness-curve.component';
import { ErrorComponent } from './error/error.component';

// MARK: App Modules
import { UploadModule } from 'src/app/uploader/upload.module'

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
    ProgressSpinnerModule,
    UploadModule
  ],
  providers: [AppState],
  bootstrap: [AppComponent]
})
export class AppModule { }
