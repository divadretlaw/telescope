import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrightnessCurveComponent } from './brightness-curve/brightness-curve.component';
import { ErrorComponent } from './error/error.component';

const appRoutes: Routes = [
  { path: '', component: BrightnessCurveComponent },
  { path: '**', component: ErrorComponent } // error
];


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(
    appRoutes,
    { enableTracing: true } // <-- debugging purposes only
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }