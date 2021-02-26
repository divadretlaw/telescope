import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppState } from '../app.state';
import { BrightnessCurveData } from '../model/brightness-curve-data';
import { CalculateOptions } from '../model/calculate-options';

class ChartData {
  label: string
  data: any[]
  show: boolean
  color: string

  constructor(label: string, color: string) {
    this.label = label;
    this.data = [];
    this.show = true;
    this.color = color;
  }

  getDataset() {
    return { label: this.label, data: this.data, fill: false, borderColor: this.color }
  }
}

@Component({
  selector: 'app-brightness-curve-chart',
  templateUrl: './brightness-curve-chart.component.html',
  styleUrls: ['./brightness-curve-chart.component.css']
})
export class BrightnessCurveChartComponent implements OnInit {
  calculateOptions: typeof CalculateOptions = CalculateOptions;

  data: any;

  downloadItems: MenuItem[];

  public average = new ChartData('Average', '#99E8D5');
  public median = new ChartData('Median', '#EF82B1');
  public minimum = new ChartData('Minimum', '#74B6F6');
  public maximum = new ChartData('Maximum', '#FC6A5D'); 

  private raw: BrightnessCurveData

  constructor(private appState: AppState, private router: Router) {
    this.raw = appState.getBrightnessCurveData();

    this.downloadItems = 
      [{
        label: 'Brightness Curve (.json)',
        icon: 'pi pi-file',
        command: () => {
          this.save(CalculateOptions.JSON);
        }
      },
      {
        label: 'Brightness Curve (.csv)',
        icon: 'pi pi-file-excel',
        command: () => {
          this.save(CalculateOptions.CSV);
        }
      }];

    this.raw.json = JSON.parse('{"center": {"x": 3372, "y": 2251, "radius": 2}, "star": {"x": 3372, "y": 2351, "line": {"length": 100, "width": 2}}, "data": [{"index": 0, "average": 5.0, "median": 6.0, "minimum": 5.0, "maximum": 6.0, "origin": {"x": 3456, "y": 2305, "radius": 2}}, {"index": 1, "average": 6.0, "median": 6.0, "minimum": 5.0, "maximum": 10.0, "origin": {"x": 3455, "y": 2305, "radius": 2}}, {"index": 2, "average": 6.0, "median": 6.0, "minimum": 4.0, "maximum": 10.0, "origin": {"x": 3455, "y": 2306, "radius": 2}}, {"index": 3, "average": 7.0, "median": 6.0, "minimum": 4.0, "maximum": 17.0, "origin": {"x": 3454, "y": 2306, "radius": 2}}, {"index": 4, "average": 6.0, "median": 6.0, "minimum": 4.0, "maximum": 9.0, "origin": {"x": 3454, "y": 2307, "radius": 2}}, {"index": 5, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3454, "y": 2308, "radius": 2}}, {"index": 6, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3453, "y": 2308, "radius": 2}}, {"index": 7, "average": 5.0, "median": 6.0, "minimum": 4.0, "maximum": 7.0, "origin": {"x": 3453, "y": 2309, "radius": 2}}, {"index": 8, "average": 5.0, "median": 6.0, "minimum": 5.0, "maximum": 7.0, "origin": {"x": 3452, "y": 2309, "radius": 2}}, {"index": 9, "average": 5.0, "median": 6.0, "minimum": 4.0, "maximum": 7.0, "origin": {"x": 3452, "y": 2310, "radius": 2}}, {"index": 10, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 7.0, "origin": {"x": 3451, "y": 2311, "radius": 2}}, {"index": 11, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 5.0, "origin": {"x": 3451, "y": 2312, "radius": 2}}, {"index": 12, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3450, "y": 2312, "radius": 2}}, {"index": 13, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3450, "y": 2313, "radius": 2}}, {"index": 14, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3449, "y": 2313, "radius": 2}}, {"index": 15, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3449, "y": 2314, "radius": 2}}, {"index": 16, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3448, "y": 2314, "radius": 2}}, {"index": 17, "average": 4.0, "median": 4.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3448, "y": 2315, "radius": 2}}, {"index": 18, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3447, "y": 2315, "radius": 2}}, {"index": 19, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3447, "y": 2316, "radius": 2}}, {"index": 20, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3447, "y": 2317, "radius": 2}}, {"index": 21, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3446, "y": 2317, "radius": 2}}, {"index": 22, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 7.0, "origin": {"x": 3446, "y": 2318, "radius": 2}}, {"index": 23, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 7.0, "origin": {"x": 3445, "y": 2318, "radius": 2}}, {"index": 24, "average": 4.0, "median": 4.0, "minimum": 3.0, "maximum": 7.0, "origin": {"x": 3445, "y": 2319, "radius": 2}}, {"index": 25, "average": 5.0, "median": 5.0, "minimum": 3.0, "maximum": 7.0, "origin": {"x": 3444, "y": 2319, "radius": 2}}, {"index": 26, "average": 5.0, "median": 5.0, "minimum": 3.0, "maximum": 7.0, "origin": {"x": 3444, "y": 2320, "radius": 2}}, {"index": 27, "average": 4.0, "median": 5.0, "minimum": 3.0, "maximum": 7.0, "origin": {"x": 3443, "y": 2320, "radius": 2}}, {"index": 28, "average": 5.0, "median": 5.0, "minimum": 3.0, "maximum": 7.0, "origin": {"x": 3443, "y": 2321, "radius": 2}}, {"index": 29, "average": 5.0, "median": 5.0, "minimum": 5.0, "maximum": 7.0, "origin": {"x": 3442, "y": 2321, "radius": 2}}, {"index": 30, "average": 5.0, "median": 5.0, "minimum": 3.0, "maximum": 7.0, "origin": {"x": 3442, "y": 2322, "radius": 2}}, {"index": 31, "average": 4.0, "median": 5.0, "minimum": 3.0, "maximum": 6.0, "origin": {"x": 3441, "y": 2322, "radius": 2}}, {"index": 32, "average": 4.0, "median": 4.0, "minimum": 3.0, "maximum": 6.0, "origin": {"x": 3441, "y": 2323, "radius": 2}}, {"index": 33, "average": 4.0, "median": 4.0, "minimum": 3.0, "maximum": 7.0, "origin": {"x": 3440, "y": 2323, "radius": 2}}, {"index": 34, "average": 4.0, "median": 5.0, "minimum": 3.0, "maximum": 7.0, "origin": {"x": 3440, "y": 2324, "radius": 2}}, {"index": 35, "average": 5.0, "median": 5.0, "minimum": 3.0, "maximum": 7.0, "origin": {"x": 3439, "y": 2324, "radius": 2}}, {"index": 36, "average": 5.0, "median": 6.0, "minimum": 4.0, "maximum": 7.0, "origin": {"x": 3439, "y": 2325, "radius": 2}}, {"index": 37, "average": 5.0, "median": 6.0, "minimum": 4.0, "maximum": 7.0, "origin": {"x": 3438, "y": 2325, "radius": 2}}, {"index": 38, "average": 5.0, "median": 6.0, "minimum": 5.0, "maximum": 7.0, "origin": {"x": 3438, "y": 2326, "radius": 2}}, {"index": 39, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3437, "y": 2326, "radius": 2}}, {"index": 40, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 5.0, "origin": {"x": 3436, "y": 2326, "radius": 2}}, {"index": 41, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3436, "y": 2327, "radius": 2}}, {"index": 42, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3435, "y": 2327, "radius": 2}}, {"index": 43, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3435, "y": 2328, "radius": 2}}, {"index": 44, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3434, "y": 2328, "radius": 2}}, {"index": 45, "average": 5.0, "median": 5.0, "minimum": 5.0, "maximum": 6.0, "origin": {"x": 3434, "y": 2329, "radius": 2}}, {"index": 46, "average": 5.0, "median": 5.0, "minimum": 5.0, "maximum": 6.0, "origin": {"x": 3433, "y": 2329, "radius": 2}}, {"index": 47, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3433, "y": 2330, "radius": 2}}, {"index": 48, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 5.0, "origin": {"x": 3432, "y": 2330, "radius": 2}}, {"index": 49, "average": 6.0, "median": 6.0, "minimum": 4.0, "maximum": 9.0, "origin": {"x": 3431, "y": 2331, "radius": 2}}, {"index": 50, "average": 8.0, "median": 8.0, "minimum": 5.0, "maximum": 15.0, "origin": {"x": 3430, "y": 2331, "radius": 2}}, {"index": 51, "average": 7.0, "median": 6.0, "minimum": 4.0, "maximum": 15.0, "origin": {"x": 3430, "y": 2332, "radius": 2}}, {"index": 52, "average": 7.0, "median": 8.0, "minimum": 4.0, "maximum": 15.0, "origin": {"x": 3429, "y": 2332, "radius": 2}}, {"index": 53, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 10.0, "origin": {"x": 3429, "y": 2333, "radius": 2}}, {"index": 54, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 10.0, "origin": {"x": 3428, "y": 2333, "radius": 2}}, {"index": 55, "average": 5.0, "median": 6.0, "minimum": 4.0, "maximum": 7.0, "origin": {"x": 3427, "y": 2333, "radius": 2}}, {"index": 56, "average": 4.0, "median": 4.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3427, "y": 2334, "radius": 2}}, {"index": 57, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3426, "y": 2334, "radius": 2}}, {"index": 58, "average": 6.0, "median": 6.0, "minimum": 4.0, "maximum": 13.0, "origin": {"x": 3426, "y": 2335, "radius": 2}}, {"index": 59, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3425, "y": 2335, "radius": 2}}, {"index": 60, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3424, "y": 2335, "radius": 2}}, {"index": 61, "average": 4.0, "median": 5.0, "minimum": 3.0, "maximum": 6.0, "origin": {"x": 3424, "y": 2336, "radius": 2}}, {"index": 62, "average": 4.0, "median": 5.0, "minimum": 3.0, "maximum": 6.0, "origin": {"x": 3423, "y": 2336, "radius": 2}}, {"index": 63, "average": 4.0, "median": 4.0, "minimum": 3.0, "maximum": 6.0, "origin": {"x": 3423, "y": 2337, "radius": 2}}, {"index": 64, "average": 4.0, "median": 4.0, "minimum": 3.0, "maximum": 5.0, "origin": {"x": 3422, "y": 2337, "radius": 2}}, {"index": 65, "average": 4.0, "median": 4.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3421, "y": 2337, "radius": 2}}, {"index": 66, "average": 4.0, "median": 4.0, "minimum": 4.0, "maximum": 4.0, "origin": {"x": 3421, "y": 2338, "radius": 2}}, {"index": 67, "average": 4.0, "median": 4.0, "minimum": 3.0, "maximum": 5.0, "origin": {"x": 3420, "y": 2338, "radius": 2}}, {"index": 68, "average": 4.0, "median": 5.0, "minimum": 3.0, "maximum": 5.0, "origin": {"x": 3419, "y": 2338, "radius": 2}}, {"index": 69, "average": 4.0, "median": 4.0, "minimum": 2.0, "maximum": 5.0, "origin": {"x": 3419, "y": 2339, "radius": 2}}, {"index": 70, "average": 4.0, "median": 4.0, "minimum": 2.0, "maximum": 5.0, "origin": {"x": 3418, "y": 2339, "radius": 2}}, {"index": 71, "average": 4.0, "median": 5.0, "minimum": 3.0, "maximum": 5.0, "origin": {"x": 3417, "y": 2339, "radius": 2}}, {"index": 72, "average": 4.0, "median": 5.0, "minimum": 3.0, "maximum": 5.0, "origin": {"x": 3417, "y": 2340, "radius": 2}}, {"index": 73, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3416, "y": 2340, "radius": 2}}, {"index": 74, "average": 4.0, "median": 4.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3415, "y": 2340, "radius": 2}}, {"index": 75, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 5.0, "origin": {"x": 3415, "y": 2341, "radius": 2}}, {"index": 76, "average": 4.0, "median": 4.0, "minimum": 4.0, "maximum": 5.0, "origin": {"x": 3414, "y": 2341, "radius": 2}}, {"index": 77, "average": 4.0, "median": 4.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3413, "y": 2341, "radius": 2}}, {"index": 78, "average": 4.0, "median": 4.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3413, "y": 2342, "radius": 2}}, {"index": 79, "average": 5.0, "median": 6.0, "minimum": 4.0, "maximum": 7.0, "origin": {"x": 3412, "y": 2342, "radius": 2}}, {"index": 80, "average": 6.0, "median": 6.0, "minimum": 4.0, "maximum": 7.0, "origin": {"x": 3411, "y": 2342, "radius": 2}}, {"index": 81, "average": 5.0, "median": 6.0, "minimum": 4.0, "maximum": 7.0, "origin": {"x": 3411, "y": 2343, "radius": 2}}, {"index": 82, "average": 5.0, "median": 6.0, "minimum": 5.0, "maximum": 7.0, "origin": {"x": 3410, "y": 2343, "radius": 2}}, {"index": 83, "average": 5.0, "median": 6.0, "minimum": 5.0, "maximum": 6.0, "origin": {"x": 3409, "y": 2343, "radius": 2}}, {"index": 84, "average": 5.0, "median": 5.0, "minimum": 5.0, "maximum": 6.0, "origin": {"x": 3408, "y": 2343, "radius": 2}}, {"index": 85, "average": 5.0, "median": 5.0, "minimum": 5.0, "maximum": 6.0, "origin": {"x": 3408, "y": 2344, "radius": 2}}, {"index": 86, "average": 5.0, "median": 5.0, "minimum": 5.0, "maximum": 6.0, "origin": {"x": 3407, "y": 2344, "radius": 2}}, {"index": 87, "average": 5.0, "median": 5.0, "minimum": 5.0, "maximum": 6.0, "origin": {"x": 3406, "y": 2344, "radius": 2}}, {"index": 88, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3406, "y": 2345, "radius": 2}}, {"index": 89, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3405, "y": 2345, "radius": 2}}, {"index": 90, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3404, "y": 2345, "radius": 2}}, {"index": 91, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3403, "y": 2345, "radius": 2}}, {"index": 92, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3403, "y": 2346, "radius": 2}}, {"index": 93, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 7.0, "origin": {"x": 3402, "y": 2346, "radius": 2}}, {"index": 94, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 7.0, "origin": {"x": 3401, "y": 2346, "radius": 2}}, {"index": 95, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 7.0, "origin": {"x": 3400, "y": 2346, "radius": 2}}, {"index": 96, "average": 4.0, "median": 4.0, "minimum": 4.0, "maximum": 7.0, "origin": {"x": 3399, "y": 2347, "radius": 2}}, {"index": 97, "average": 4.0, "median": 4.0, "minimum": 4.0, "maximum": 5.0, "origin": {"x": 3398, "y": 2347, "radius": 2}}, {"index": 98, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3397, "y": 2347, "radius": 2}}, {"index": 99, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3396, "y": 2347, "radius": 2}}, {"index": 100, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3396, "y": 2348, "radius": 2}}, {"index": 101, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3395, "y": 2348, "radius": 2}}, {"index": 102, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3394, "y": 2348, "radius": 2}}, {"index": 103, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3393, "y": 2348, "radius": 2}}, {"index": 104, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3392, "y": 2348, "radius": 2}}, {"index": 105, "average": 4.0, "median": 4.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3391, "y": 2348, "radius": 2}}, {"index": 106, "average": 4.0, "median": 4.0, "minimum": 4.0, "maximum": 5.0, "origin": {"x": 3391, "y": 2349, "radius": 2}}, {"index": 107, "average": 4.0, "median": 4.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3390, "y": 2349, "radius": 2}}, {"index": 108, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3389, "y": 2349, "radius": 2}}, {"index": 109, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3388, "y": 2349, "radius": 2}}, {"index": 110, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 7.0, "origin": {"x": 3387, "y": 2349, "radius": 2}}, {"index": 111, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 7.0, "origin": {"x": 3386, "y": 2349, "radius": 2}}, {"index": 112, "average": 4.0, "median": 4.0, "minimum": 4.0, "maximum": 5.0, "origin": {"x": 3386, "y": 2350, "radius": 2}}, {"index": 113, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3385, "y": 2350, "radius": 2}}, {"index": 114, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3384, "y": 2350, "radius": 2}}, {"index": 115, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3383, "y": 2350, "radius": 2}}, {"index": 116, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 8.0, "origin": {"x": 3382, "y": 2350, "radius": 2}}, {"index": 117, "average": 6.0, "median": 6.0, "minimum": 4.0, "maximum": 10.0, "origin": {"x": 3381, "y": 2350, "radius": 2}}, {"index": 118, "average": 6.0, "median": 7.0, "minimum": 5.0, "maximum": 10.0, "origin": {"x": 3380, "y": 2350, "radius": 2}}, {"index": 119, "average": 6.0, "median": 6.0, "minimum": 5.0, "maximum": 10.0, "origin": {"x": 3379, "y": 2350, "radius": 2}}, {"index": 120, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 8.0, "origin": {"x": 3378, "y": 2350, "radius": 2}}, {"index": 121, "average": 4.0, "median": 5.0, "minimum": 3.0, "maximum": 6.0, "origin": {"x": 3377, "y": 2350, "radius": 2}}, {"index": 122, "average": 4.0, "median": 4.0, "minimum": 3.0, "maximum": 6.0, "origin": {"x": 3376, "y": 2350, "radius": 2}}, {"index": 123, "average": 4.0, "median": 4.0, "minimum": 3.0, "maximum": 6.0, "origin": {"x": 3375, "y": 2350, "radius": 2}}, {"index": 124, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3374, "y": 2350, "radius": 2}}, {"index": 125, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3373, "y": 2350, "radius": 2}}, {"index": 126, "average": 5.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3372, "y": 2350, "radius": 2}}, {"index": 127, "average": 4.0, "median": 5.0, "minimum": 4.0, "maximum": 6.0, "origin": {"x": 3372, "y": 2351, "radius": 2}}]}');
  }

  ngOnInit(): void {
    if (!this.raw.json) {
      this.router.navigateByUrl('/error?reason=invalidData');
    }

    let labels: string[] = [];

    for (let index in this.raw.json['data']) {
      let data = this.raw.json.data[index];
      labels.push(index);
      this.average.data.push(data.average);
      this.median.data.push(data.median);
      this.minimum.data.push(data.minimum);
      this.maximum.data.push(data.maximum);
    }

    this.data = {
      labels: labels,
      datasets: [
        this.average.getDataset(),
        this.median.getDataset(), 
        this.minimum.getDataset(),
        this.maximum.getDataset()]
    }

    console.log(this.data);
  }

  public update(event: Event) {
    let labels = this.data.labels;
    let datasets = [];

    if (this.average.show) {
      datasets.push(this.average.getDataset());
    }

    if (this.median.show) {
      datasets.push(this.median.getDataset());
    }

    if (this.minimum.show) {
      datasets.push(this.minimum.getDataset());
    }

    if (this.maximum.show) {
      datasets.push(this.maximum.getDataset());
    }

    this.data = {
      labels: labels,
      datasets: datasets
    }
  }

  public edit() {
    this.router.navigateByUrl('/brightnessCurve');
  }

  public save(option: CalculateOptions) {
    // TODO: Convert to CSV
    // TODO: Save as file
  }

}
