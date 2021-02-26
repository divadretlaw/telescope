import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { FileUploadModule } from 'ng2-file-upload';
import { NgxFileDropModule } from 'ngx-file-drop';

import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { UploadComponent } from './upload.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FileUploadModule,
        NgxFileDropModule,
        ProgressSpinnerModule
    ],
    declarations: [UploadComponent],
    exports: [UploadComponent]
  })
export class UploadModule {}
