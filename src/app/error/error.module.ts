import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';

import { ErrorComponent } from './error.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ButtonModule
  ],
  declarations: [ErrorComponent],
  exports: [ErrorComponent]
})
export class ErrorModule {}
