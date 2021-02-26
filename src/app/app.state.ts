import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { BrightnessCurveData } from "./model/brightness-curve-data";

@Injectable({
    providedIn: 'root',
})
export class AppState {
    public brightnessCurveData: BehaviorSubject<BrightnessCurveData>;

    constructor() {
        console.debug('AppState.constructor')
        this.brightnessCurveData = new BehaviorSubject(new BrightnessCurveData())
    }
    
    public getBrightnessCurveData(): BrightnessCurveData {
        console.debug('AppState.getBrightnessCurveData')
        return this.brightnessCurveData.value;
    }

    public setBrightnessCurveData(brightnessCurveData: BrightnessCurveData) {
        console.debug('AppState.setBrightnessCurveData')
        this.brightnessCurveData.next(brightnessCurveData)
    }

    public hasRocketLaunched(ifOnline, ifOffline) {
        let image = new Image();
        image.onload = function() {
            ifOnline && ifOnline.constructor == Function && ifOnline();
        };
        image.onerror = function() {
            ifOffline && ifOffline.constructor == Function && ifOffline();
        };
        image.src = `http://localhost:40270/status.gif?${Date.now()}`;        
    }
}