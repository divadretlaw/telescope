import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrightnessCurveComponent } from './brightness-curve/brightness-curve.component';
import { BrightnessCurveChartComponent } from './brightness-curve-chart/brightness-curve-chart.component';
import { ErrorComponent } from './error/error.component';

const appRoutes: Routes = [
  { path: '', component: BrightnessCurveComponent },
  { path: 'brightnessCurve', component: BrightnessCurveComponent },
  { path: 'brightnessCurve/chart', component: BrightnessCurveChartComponent },
  { path: '**', component: ErrorComponent } // error
];


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(
    appRoutes,
    { enableTracing: false } // <-- debugging purposes only
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
