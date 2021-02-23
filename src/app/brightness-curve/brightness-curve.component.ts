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
  isLoading = false;

  @ViewChild('universe', { static: true, read: ElementRef }) canvas: ElementRef;
  private context: CanvasRenderingContext2D;

  file: File;
  image: HTMLImageElement = null;

  reference: Updateable<Point>
  star: Updateable<Star>;

  downloadItems: MenuItem[];

  private forceDraw = false;
  private mouse = { down: false, selected: null };

  constructor(private router: Router, private http: HttpClient, private deviceService: DeviceDetectorService) {
    if (environment.production) {
      this.reference = new Updateable(new Point(100, 100, 5), new Point(-1, -1, -1));
      this.star = new Updateable(new Star(200, 200, 100, 2), new Star(-1, -1, -1, -1));
    } else {
      this.reference = new Updateable(new Point(820, 151, 5), new Point(-1, -1, -1));
      this.star = new Updateable(new Star(698, 441, 100, 2), new Star(-1, -1, -1, -1));
    }
  }

  ngOnInit(): void {
    let deviceInfo = this.deviceService.getDeviceInfo();
    console.debug("ngOnInit()", deviceInfo);

    this.downloadItems = 
      [{
        label: 'Brightness Curve (.json)',
        icon: 'pi pi-file',
        command: () => {
          this.calculateAndDownload();
        }
      },
      {
        label: 'Brightness Curve (.csv)',
        icon: 'pi pi-file-excel',
        command: () => {
          this.calculateAndDownload(1);
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

  setLoading(loading: boolean) {
    if (loading) {
      this.isLoading = true;
      document.getElementById("main").className = 'modal-open';
    } else {
      this.isLoading = false;
      document.getElementById("main").className = '';
    }
  }

  openImage(files: any, form: FileUpload) {
    console.debug("openImage(files:)", files, form);

    let self = this;
    this.file = files.files[0];
    console.debug(this.file);

    console.log(window.webkitURL);
    this.loadJpegPreview();

    form.clear();
  }

  loadJpegPreview() {
    this.setLoading(true);

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
          self.setLoading(false);
        }

        self.image = image;
        self.forceDraw = true;
      }
    });

    xhr.open("POST", "http://localhost:40270/preview");
    xhr.send(data);
  }

  calculateAndDownload(option: number = 0) {
    let type: string
    let fileExtension: string
    
    switch (option) {
      case 1:
        type = 'text/csv';
        fileExtension = '.csv';
        break;
      default:
        type = 'text/json';
        fileExtension = '.json';
        break;
    }

    let parameters = {
      reference: this.reference.value,
      star: this.star.value,
      csv: option == 1
    }
    let json = JSON.stringify(parameters);

    var data = new FormData();
    data.append("file", this.file);
    data.append("parameters", json);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        const blob = new Blob([this.responseText], { type: type });

        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `result${fileExtension}`;
        link.click();
      }
    });

    xhr.open("POST", "http://localhost:40270/brightness_curve");
    xhr.send(data);
  }

  calculatePreview() {
    let parameters = { reference: this.reference.value, star: this.star.value, preview: true }
    let json = JSON.stringify(parameters);

    var data = new FormData();
    data.append("file", this.file);
    data.append("parameters", json);

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
          self.setLoading(false);
        }

        self.image = image;
        self.forceDraw = true;
      }
    });

    xhr.open("POST", "http://localhost:40270/brightness_curve");
    xhr.send(data);
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
    ctx.lineWidth = 1 + this.star.value.line.width * 2;

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
