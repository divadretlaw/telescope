import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app.routing';
import { AppState } from './app.state';
import { AppComponent } from './app.component';

import { UploadModule } from 'src/app/uploader/upload.module';
import { StartModule } from './start/start.module'
import { ErrorModule } from 'src/app/error/error.module';
import { BrightnessCurveModule } from './brightness-curve/brightness-curve.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    StartModule,
    UploadModule,
    BrightnessCurveModule,
    ErrorModule
  ],
  providers: [AppState],
  bootstrap: [AppComponent]
})
export class AppModule {}
