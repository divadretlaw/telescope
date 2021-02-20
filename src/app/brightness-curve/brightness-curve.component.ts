import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Point } from '../model/point';
import { Star } from '../model/star';
import { Updateable } from '../model/updateable';

import { environment } from '../../environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';

import { FileUpload } from 'primeng/fileupload';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-brightness-curve',
  templateUrl: './brightness-curve.component.html',
  styleUrls: ['./brightness-curve.component.css']
})
export class BrightnessCurveComponent implements OnInit {
  @ViewChild('universe', { static: true, read: ElementRef }) canvas: ElementRef;
  private context: CanvasRenderingContext2D;

  file: File;
  image: HTMLImageElement = null;
  isTiffSupported = false;

  reference: Updateable<Point>
  star: Updateable<Star>;

  downloadItems: MenuItem[];

  private forceDraw = false;
  private mouse = { down: false, selected: null };

  constructor(private router: Router, private http: HttpClient, private deviceService: DeviceDetectorService) {
    if (environment.production) {
      this.reference = new Updateable(new Point(100, 100, 5), new Point(-1, -1, -1));
      this.star = new Updateable(new Star(200, 200, 100, 5), new Star(-1, -1, -1, -1));
    } else {
      this.reference = new Updateable(new Point(820, 151, 5), new Point(-1, -1, -1));
      this.star = new Updateable(new Star(698, 441, 100, 5), new Star(-1, -1, -1, -1));
    }
  }

  ngOnInit(): void {
    let deviceInfo = this.deviceService.getDeviceInfo();
    console.debug("ngOnInit()", deviceInfo);

    switch (deviceInfo.browser) {
      case 'Safari':
      case 'safari':
        this.isTiffSupported = true;
        break;
      default:
        this.isTiffSupported = false;
        break;
    }

    this.downloadItems = 
      [{
        label: 'Download Brightness Curve (.json)',
        icon: 'pi pi-file',
        command: () => {
          this.brightness_curve_json();
        }
      },
      {
        label: 'Download Brightness Curve (.csv)',
        icon: 'pi pi-file-excel',
        command: () => {
          this.brightness_curve_csv();
        }
      }];
  }

  ngAfterViewInit(): void {
    console.debug("ngAfterViewInit()");

    this.context = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.addEventListener('mousedown', (e: MouseEvent) => {
      this.mouse.down = true;

      let size = this.canvas.nativeElement.getBoundingClientRect();
      let xFactor = this.canvas.nativeElement.width / size.width;
      let yFactor = this.canvas.nativeElement.height / size.height;

      let mouseX = e.offsetX * xFactor;
      let mouseY = e.offsetY * yFactor;

      if (this.hitTest(this.reference.value, mouseX, mouseY)) {
        this.mouse.selected = this.reference.value;
      } else if (this.hitTest(this.star.value, mouseX, mouseY)) {
        this.mouse.selected = this.star.value;
      }
    });
    this.canvas.nativeElement.addEventListener('mouseup', () => {
      this.mouse.down = false;
      this.mouse.selected = null;
    });
    this.canvas.nativeElement.addEventListener('mousemove', (e: MouseEvent) => {
      // e.preventDefault();
      // e.stopPropagation();
      if (!this.mouse.down || this.mouse.selected == null) {
        return;
      }
      
      let size = this.canvas.nativeElement.getBoundingClientRect();
      let xFactor = this.canvas.nativeElement.width / size.width;
      let yFactor = this.canvas.nativeElement.height / size.height;

      let mouseX = e.offsetX * xFactor;
      let mouseY = e.offsetY * yFactor;

      this.mouse.selected.x = Math.round(mouseX);
      this.mouse.selected.y = Math.round(mouseY);
    });
  }

  handleFileInput(files: any, form: FileUpload) {
    console.debug("handleFileInput(files:)", files, form);

    let self = this;
    this.file = files.files[0];
    console.debug(this.file);

    console.log(window.webkitURL);

    if (this.isTiffSupported) {
      let image = new Image();
      image.src = URL.createObjectURL(this.file);
      image.onload = function() {
        self.draw();
      }
  
      this.image = image;
      this.forceDraw = true;
    } else {
      this.loadJpegPreview();
    }

    form.clear();
  }

  loadJpegPreview() {
    var data = new FormData();
    data.append("file", this.file);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.responseType = 'blob'

    let self = this;
    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        var urlCreator = window.webkitURL || window.URL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        console.log('imageURL', imageUrl);

        let image = new Image();
        image.src = imageUrl;
        image.onload = function() {
          self.draw();
        }

        self.image = image;
        self.forceDraw = true;
      }
    });

    xhr.open("POST", "http://localhost:5000/tiff_converter");
    xhr.send(data);
  }

  brightness_curve_csv() {
    let parameters = { reference: this.reference.value, star: this.star.value, csv: true }
    let json = JSON.stringify(parameters);

    var data = new FormData();
    data.append("file", this.file);
    data.append("parameters", json);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        const blob = new Blob([this.responseText], { type: 'text/csv' });

        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'result.csv';
        link.click();
      }
    });

    xhr.open("POST", "http://localhost:5000/brightness_curve");
    xhr.send(data);
  }

  brightness_curve_json() {
    let parameters = { reference: this.reference.value, star: this.star.value }
    let json = JSON.stringify(parameters);

    var data = new FormData();
    data.append("file", this.file);
    data.append("parameters", json);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        const blob = new Blob([this.responseText], { type: 'text/json' });

        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'result.json';
        link.click();
      }
    });

    xhr.open("POST", "http://localhost:5000/brightness_curve");
    xhr.send(data);
  }

  // Not working for some reason
  brightness_curve() {
    let parameters = { reference: this.reference.value, star: this.star.value }
    let json = JSON.stringify(parameters);

    var data = new FormData();
    data.append('file', this.file, this.file.name);
    data.append('parameters', json);

    this.http
    .post('http://localhost:5000/brightness_curve', data)
    .subscribe(data => {
      console.log("data", data);
    }, error => {
      console.error(error);
    });
  }

  draw() {
    if (this.canvas == undefined  || this.context == undefined || this.image == undefined) {
      console.error("Unable to draw()");
      return;
    }

    if (!this.forceDraw && !this.reference.didChange() && !this.star.didChange()) {
      requestAnimationFrame(this.draw.bind(this));
      return;
    }

    this.canvas.nativeElement.width = this.image.width;
    this.canvas.nativeElement.height = this.image.height;

    this.canvas.nativeElement.style = `min-width: ${this.image.width}px; min-height: ${this.image.height}px`

    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    let size = this.canvas.nativeElement.getBoundingClientRect();

    // Draw Image
    this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height,
      0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    // Draw reference point
    this.drawReferencePoint();
    // Draw star
    this.drawStar();

    console.log("did draw");
    this.forceDraw = false;
    requestAnimationFrame(this.draw.bind(this));
  }

  private drawReferencePoint() {
    let ctx = this.context;

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.arc(this.reference.value.x, this.reference.value.y, this.reference.value.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = this.reference.value.color;
    ctx.stroke();
    ctx.closePath();

    this.reference.update()
  }

  private drawStar() {
    let ctx = this.context;
    
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.arc(this.star.value.x, this.star.value.y, this.star.value.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = this.star.value.color;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.lineWidth = this.star.value.line.width;

    let x = this.star.value.x - this.reference.value.x;
    let y = this.star.value.y - this.reference.value.y;

    let radius = Math.sqrt(Math.pow(Math.abs(x), 2) + Math.pow(Math.abs(y), 2));

    let startAngle = Math.acos(x / radius);
    let arc = this.star.value.line.length / radius;
    if (y <= 0) {
      startAngle *= -1;
    }
    let endAngle= startAngle - arc;

    ctx.arc(this.reference.value.x, this.reference.value.y, radius, startAngle, endAngle, true);

    ctx.strokeStyle = this.star.value.color;
    ctx.stroke();
    ctx.closePath();

    this.star.update();
  }

  private hitTest(value: Point, mouseX: number, mouseY: number): boolean {
    let returnValue = false;
    this.context.beginPath();
    this.context.arc(value.x, value.y, value.radius + 10, 0, 2 * Math.PI);
    if (this.context.isPointInPath(mouseX, mouseY)) {
      returnValue = true;
    }
    this.context.closePath();
    return returnValue;
  }
}
