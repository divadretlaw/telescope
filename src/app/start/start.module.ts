import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { StartComponent } from './start.component';

@NgModule({
  imports: [
      CommonModule,
      BrowserModule,
      FormsModule,
      ProgressSpinnerModule
  ],
  declarations: [StartComponent],
  exports: [StartComponent]
})
export class StartModule {}
