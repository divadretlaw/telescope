import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxFileDropModule } from 'ngx-file-drop';
import { UploadComponent } from './upload.component';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ProgressSpinnerModule} from 'primeng/progressspinner';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FileUploadModule,
        NgxFileDropModule,
        MessagesModule,
        MessageModule,
        ProgressSpinnerModule
    ],
    declarations: [UploadComponent],
    exports: [UploadComponent]
  })
export class UploadModule {}
