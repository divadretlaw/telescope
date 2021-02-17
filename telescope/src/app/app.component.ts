import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef,  OnInit, ViewChild } from '@angular/core';
import { Point } from './point';
import { Star } from './star';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('universe', { static: true, read: ElementRef }) canvas: ElementRef;
  private context: CanvasRenderingContext2D;

  file: File;
  image: HTMLImageElement = null;

  reference: Point;
  star: Star;
  private mouse = { down: false };

  constructor(private http: HttpClient) {
    this.reference = new Point(820, 151, 5);
    this.star = new Star(698, 441, 100, 5);
  }

  ngOnInit(): void {
    console.debug("ngOnInit()");
  }

  ngAfterViewInit(): void {
    console.debug("ngAfterViewInit()");

    this.context = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.addEventListener('mousedown', () => {
      this.mouse.down = true;
    });
    this.canvas.nativeElement.addEventListener('mouseup', () => {
      this.mouse.down = false;
    });
    this.canvas.nativeElement.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this.mouse.down) {
        return;
      }
      
      let size = this.canvas.nativeElement.getBoundingClientRect();
      let xFactor = this.canvas.nativeElement.width / size.width;
      let yFactor = this.canvas.nativeElement.height / size.height;

      let mouseX = e.offsetX * xFactor;
      let mouseY = e.offsetY * yFactor;

      if (this.hitTest(this.reference, mouseX, mouseY)) {
        this.reference.x = Math.round(mouseX);
        this.reference.y = Math.round(mouseY);
      } else if (this.hitTest(this.star, mouseX, mouseY)) {
        this.star.x = Math.round(mouseX);
        this.star.y = Math.round(mouseY);
      }

      this.draw();
    });
  }

  handleFileInput(files: any) {
    console.debug("handleFileInput(files:)", files);

    let self = this;
    this.file = files.files[0];
    console.debug(this.file);

    let image = new Image();
    image.src = URL.createObjectURL(this.file);
    image.onload = function() {
      self.draw();
    }

    this.image = image;
  }

  brightness_curve_xhr() {
    let parameters = { reference: this.reference, star: this.star }
    let json = JSON.stringify(parameters);

    var data = new FormData();
    data.append("file", this.file, "startrails-an-der-kleinen-kalmit-20049844-2e00-4822-8a55-6de139cf207a.jpg");
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

  // Not working for some reason
  brightness_curve() {
    let parameters = { reference: this.reference, star: this.star }
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

    this.canvas.nativeElement.width = this.image.width;
    this.canvas.nativeElement.height = this.image.height;

    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    // Draw Image
    this.context.drawImage(this.image, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    // Draw reference point
    this.drawReferencePoint();
    // Draw star
    this.drawStar();
  }

  private drawReferencePoint() {
    let ctx = this.context;

    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.arc(this.reference.x, this.reference.y, this.reference.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FC6A5D';
    ctx.stroke();
    ctx.closePath();
  }

  private drawStar() {
    let ctx = this.context;
    
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.arc(this.star.x, this.star.y, this.star.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#74B6F6';
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.lineWidth = this.star.line.width;

    let x = this.star.x - this.reference.x;
    let y = this.star.y - this.reference.y;

    let radius = Math.sqrt(Math.pow(Math.abs(x), 2) + Math.pow(Math.abs(y), 2));

    let startAngle = Math.acos(x / radius);
    let arc = this.star.line.length / radius;
    if (y <= 0) {
      startAngle *= -1;
    }
    let endAngle= startAngle - arc;

    ctx.arc(this.reference.x, this.reference.y, radius, startAngle, endAngle, true);

    ctx.strokeStyle = '#74B6F6';
    ctx.stroke();
    ctx.closePath();
  }

  private hitTest(value: Point, mouseX: number, mouseY: number): boolean {
    let returnValue = false;
    this.context.beginPath();
    this.context.arc(value.x, value.y, value.radius + 10, 0, 2 * Math.PI);
    this.context.fill()
    if (this.context.isPointInPath(mouseX, mouseY)) {
      returnValue = true;
    }
    this.context.closePath();
    return returnValue;
  }
}
