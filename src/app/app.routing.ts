import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartComponent } from './start/start.component';
import { BrightnessCurveComponent } from './brightness-curve/brightness-curve.component';
import { BrightnessCurveChartComponent } from './brightness-curve/chart/chart.component';
import { ErrorComponent } from './error/error.component';

const appRoutes: Routes = [
  { path: '', component: StartComponent },
  { path: 'brightnessCurve', component: BrightnessCurveComponent },
  { path: 'brightnessCurve/chart', component: BrightnessCurveChartComponent },
  { path: '**', component: ErrorComponent } // error
];

@NgModule({
  imports: [RouterModule.forRoot(
    appRoutes,
    { enableTracing: false } // <-- debugging purposes only
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
