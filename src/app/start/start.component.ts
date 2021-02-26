import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AppState } from '../app.state';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  private retry = true;

  constructor(private appState: AppState, private router: Router, private deviceService: DeviceDetectorService) {
    this.checkRocket();
  }

  ngOnInit(): void {
    let deviceInfo = this.deviceService.getDeviceInfo();
    console.debug("ngOnInit()", deviceInfo);
  }

  private checkRocket() {
    this.appState.hasRocketLaunched(() => {
      console.log('Rocket is launched...');
      this.router.navigateByUrl("/brightnessCurve");
    }, () => {
      console.log('Rocket never launched or has crashed...');
      if (this.retry === false) {
        this.router.navigateByUrl("/error?reason=rocket");
      } else {
        this.retry = false;
        setTimeout(this.checkRocket.bind(this), 1000)
      }
    });
  }
}
