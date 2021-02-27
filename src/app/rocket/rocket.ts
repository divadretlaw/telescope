import { BrightnessCurveOptions } from "./rocket.brightnessCurve";
import { BrightnessCurveData } from "../model/brightness-curve-data";
import { Subject } from "rxjs";

export class Rocket {
    public isLoading: Subject<[boolean, string]>;

    constructor() {
        this.isLoading = new Subject();
    }

    public downloadBrighnessCurve(data: BrightnessCurveData, options: BrightnessCurveOptions) {
        this.isLoading.next([true, 'Calculating']);
        this._brightnessCurve(data, options, (result) => {
            let blob;
            if (options.blobResponse) {
                blob = result.response;
            } else {
                blob = new Blob([result.responseText], { type: options.type });
            }
      
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `result${options.fileExtension}`;
            link.click();
        });
    }

    public previewBrighnessCurve(data: BrightnessCurveData, callback: Function) {
        this.isLoading.next([true, 'Debug path']);
        this._brightnessCurve(data, BrightnessCurveOptions.preview, (result) => {
            var urlCreator = window.webkitURL || window.URL;
            var imageUrl = urlCreator.createObjectURL(result.response);
            console.log('imageURL', imageUrl);

            callback(imageUrl);
        });
    }

    public brighnessCurve(data: BrightnessCurveData, callback: Function) {
        this.isLoading.next([true, 'Calculating']);
        this._brightnessCurve(data, BrightnessCurveOptions.json, (result) => {
            let json = JSON.parse(result.responseText);
            callback(json);
        });
    }

    private _brightnessCurve(data: BrightnessCurveData, options: BrightnessCurveOptions, callback: Function) {
        let parameters = {
            reference: data.reference.value,
            star: data.star.value,
            csv: options.type == 'text/csv',
            preview: options.blobResponse
        }
        let json = JSON.stringify(parameters);

        var formData = new FormData();
        formData.append("file", data.file);
        formData.append("parameters", json);

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        if (options.blobResponse) {
            xhr.responseType = 'blob';
        }

        xhr.addEventListener('readystatechange', (event) => {
            if(xhr.readyState === 4) {
                callback(xhr);
                this.isLoading.next([false, null]);
            }
        });
    
        xhr.open('POST', 'http://localhost:40270/brightness_curve');
        xhr.send(formData);
    }
}