import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BrightnessCurveData } from '../model/brightness-curve-data';
import { Point } from '../model/point';
import { Scale } from '../model/scale';
import { UploaderMode } from '../uploader/upload.component';

import { MenuItem } from 'primeng/api';
import { AppState } from '../app.state';
import { AppPath } from '../app.path';

import { Rocket } from '../rocket/rocket';
import { BrightnessCurveOptions } from '../rocket/rocket.brightnessCurve';

@Component({
  selector: 'app-brightness-curve',
  templateUrl: './brightness-curve.component.html',
  styleUrls: ['./brightness-curve.component.css']
})
export class BrightnessCurveComponent implements OnInit {
  brightnessCurveOptions: typeof BrightnessCurveOptions = BrightnessCurveOptions;
  uploaderMode: typeof UploaderMode = UploaderMode;

  data: BrightnessCurveData
  downloadItems: MenuItem[];
  private rocket: Rocket

  loadingReason = '';
  isLoading = false;

  @ViewChild('universe', { static: true, read: ElementRef }) canvas: ElementRef;
  private context: CanvasRenderingContext2D;
  scale = new Scale();
  private forceDraw = false;
  private mouse = { down: false, selected: null };
  private animationFrame: number

  private subscriptions = [];

  constructor(private appState: AppState, private activatedRoute: ActivatedRoute, private router: Router) {
    this.rocket = new Rocket();

    let data = appState.getBrightnessCurveData();
    if (this.data === null || this.data === undefined) {
      this.data = data;
    } else {
      this.data.copyFrom(data);
    }
  }

  ngOnInit(): void {
    console.debug("ngOnInit()");

    this.downloadItems = 
      [{
        label: 'Brightness Curve (.json)',
        icon: 'pi pi-file',
        command: () => {
          this.download(BrightnessCurveOptions.json);
        }
      },
      {
        label: 'Brightness Curve (.csv)',
        icon: 'pi pi-file-excel',
        command: () => {
          this.download(BrightnessCurveOptions.csv);
        }
      },
      {
        label: 'Brightness Curve (.jpeg)',
        icon: 'pi pi-image',
        command: () => {
          this.download(BrightnessCurveOptions.jpeg);
        }
      }];
  }

  ngOnDestroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  ngAfterViewInit(): void {
    console.debug("ngAfterViewInit()");
    this.context = this.canvas.nativeElement.getContext('2d');
    this.setupMouseHandler();

    let brightnessCurveSubscription = this.appState.brightnessCurveData.asObservable().subscribe(data => {
      console.log("New BrightnessCurve Data", data);
      this.data.copyFrom(data);

      if (data.file != null && data.image != null) {
        this.forceDraw = true;
        this.draw();
        this.focusOn(this.data.reference.value, false);
        this.setLoading(false);
      }
    });

    let isLoadingSubscription = this.rocket.isLoading.asObservable().subscribe(isLoading => {
      this.setLoading(isLoading[0], isLoading[1]);
    });

    this.subscriptions.push(brightnessCurveSubscription);
    this.subscriptions.push(isLoadingSubscription);
  }

  setLoading(loading: boolean, reason: string = null) {
    if (loading) {
      this.loadingReason = reason;
      this.isLoading = true;
      document.getElementById("main").className = 'modal-open';
    } else {
      this.isLoading = false;
      document.getElementById("main").className = '';
      this.focusOnStar();
    }
  }

  download(option: BrightnessCurveOptions) {
    this.rocket.downloadBrighnessCurve(this.data, option);
  }

  calculate() {
    this.rocket.brighnessCurve(this.data, (json) => {
      this.data.json = json
      this.router.navigate([AppPath.Chart], { relativeTo: this.activatedRoute });
    });
  }

  // MARK: - Draw

  draw() {
    if (this.canvas == undefined  || this.context == undefined || this.data.image == undefined) {
      console.error("Unable to draw()");
      this.animationFrame = requestAnimationFrame(this.draw.bind(this));
      return;
    }

    if (!this.forceDraw && !this.data.reference.didChange() && !this.data.star.didChange()) {
      this.animationFrame = requestAnimationFrame(this.draw.bind(this));
      return;
    }

    let scaleFactor = this.scale.factor();

    this.canvas.nativeElement.width = this.data.image.width * scaleFactor;
    this.canvas.nativeElement.height = this.data.image.height * scaleFactor;
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    this.canvas.nativeElement.style = `min-width: ${this.data.image.width * scaleFactor}px; min-height: ${this.data.image.height * scaleFactor}px`;

    // let size = this.canvas.nativeElement.getBoundingClientRect();
    this.context.scale(this.scale.factor(), this.scale.factor());

    // Draw Image
    this.context.drawImage(this.data.image, 0, 0, this.data.image.width, this.data.image.height);
    // Draw reference point
    this.drawReferencePoint();
    // Draw star
    this.drawStar();

    this.forceDraw = false;
    this.animationFrame = requestAnimationFrame(this.draw.bind(this));
  }

  private drawReferencePoint() {
    let ctx = this.context;
    let scaleFactor = this.scale.inverseFactor();

    ctx.beginPath();
    ctx.lineWidth = 3 * scaleFactor;
    let radius = 1 + this.data.reference.value.radius * 2
    ctx.arc(this.data.reference.value.x, this.data.reference.value.y, radius * scaleFactor, 0, 2 * Math.PI);
    ctx.strokeStyle = this.data.reference.value.color;
    ctx.stroke();
    ctx.closePath();

    this.data.reference.update()
  }

  private drawStar() {
    let ctx = this.context;
    let scaleFactor = this.scale.inverseFactor();

    ctx.beginPath();
    ctx.lineWidth = 3 * scaleFactor;
    ctx.arc(this.data.star.value.x, this.data.star.value.y, this.data.star.value.radius * scaleFactor, 0, 2 * Math.PI);
    ctx.strokeStyle = this.data.star.value.color;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.lineWidth = 1 + this.data.star.value.line.width * 2;

    let x = this.data.star.value.x - this.data.reference.value.x;
    let y = this.data.star.value.y - this.data.reference.value.y;

    let radius = Math.sqrt(Math.pow(Math.abs(x), 2) + Math.pow(Math.abs(y), 2));

    let startAngle = Math.acos(x / radius);
    let arc = this.data.star.value.line.length / radius;
    if (y <= 0) {
      startAngle *= -1;
    }
    let endAngle = startAngle - arc;

    ctx.arc(this.data.reference.value.x, this.data.reference.value.y, radius, startAngle, endAngle, true);

    ctx.strokeStyle = this.data.star.value.color;
    ctx.stroke();
    ctx.closePath();

    this.data.star.update();
  }

  // MARK: - Zoom

  zoomIn() {
    this.scale.zoomIn();
    this.focusOnStar();
  }

  zoomOut() {
    this.scale.zoomOut();
    this.focusOnStar();
  }

  zoomReset() {
    this.scale.reset();
    this.focusOnStar();
  }

  private focusOn(point: Point, animated) {
    let width = this.data.image.width;
    let height = this.data.image.height;

    let scaleFactor = this.scale.factor();

    const offsetX = (window.innerWidth - 366 || 0) / 2;
    const offsetY = (window.innerHeight || 0) / 2;

    let scrollLeft = Math.max(0, (scaleFactor * point.x / width * width) - offsetX);
    let scrollTop = Math.max(0, (scaleFactor * point.y / height * height) - offsetY);

    if (animated) {
      this.scrollTo(document.documentElement, scrollTop, scrollLeft, 300);
    } else {
      document.documentElement.scrollLeft = scrollLeft;
      document.documentElement.scrollTop = scrollTop;
    }

    console.debug("scrollTo", "center =", scrollLeft, scrollTop, 'scale = ', scaleFactor)

    this.forceDraw = true;
  }

  private scrollTo(element, toTop, toLeft, duration) {
    let startTop = element.scrollTop;
    let changeTop = toTop - startTop;

    let startLeft = element.scrollLeft;
    let changeLeft = toLeft - startLeft;

    let currentTime = 0;
    let increment = 20;

    let easeInOutQuad = function (t, b, c, d) {
      t /= d/2;
      if (t < 1) return c/2*t*t + b;
      t--;
      return -c/2 * (t*(t-2) - 1) + b;
    };

    let animateScroll = () => {      
        currentTime += increment;
        
        element.scrollTop = easeInOutQuad(currentTime, startTop, changeTop, duration);;
        element.scrollLeft = easeInOutQuad(currentTime, startLeft, changeLeft, duration);;

        if (currentTime < duration) {
          setTimeout(animateScroll, increment);
        }

        this.forceDraw = true;
    };
    animateScroll();
  }

  // MARK: - Mouse

  private setupMouseHandler() {
    this.canvas.nativeElement.addEventListener('mousedown', (e: MouseEvent) => {
      this.mouse.down = true;

      let size = this.canvas.nativeElement.getBoundingClientRect();
      let xFactor = this.canvas.nativeElement.width / size.width;
      let yFactor = this.canvas.nativeElement.height / size.height;

      let mouseX = e.offsetX * xFactor;
      let mouseY = e.offsetY * yFactor;
      console.log('mousedown', mouseX, mouseY);

      if (this.hitTest(this.data.reference.value, mouseX, mouseY)) {
        this.mouse.selected = this.data.reference.value;
      } else if (this.hitTest(this.data.star.value, mouseX, mouseY)) {
        this.mouse.selected = this.data.star.value;
      }
    });

    this.canvas.nativeElement.addEventListener('mouseup', () => {
      this.mouse.down = false;
      this.mouse.selected = null;
    });

    this.canvas.nativeElement.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this.mouse.down || this.mouse.selected == null) {
        return;
      }
      
      let size = this.canvas.nativeElement.getBoundingClientRect();
      let xFactor = this.canvas.nativeElement.width / (size.width * this.scale.factor());
      let yFactor = this.canvas.nativeElement.height / (size.height * this.scale.factor());

      let mouseX = e.offsetX * xFactor;
      let mouseY = e.offsetY * yFactor;

      this.mouse.selected.x = Math.round(mouseX);
      this.mouse.selected.y = Math.round(mouseY);
    });
  }

  private hitTest(value: Point, mouseX: number, mouseY: number): boolean {
    let returnValue = false;
    this.context.beginPath();
    let scaleFactor = this.scale.inverseFactor();
    let radius = 1 + value.radius * 2
    this.context.arc(value.x, value.y, radius * scaleFactor + 10, 0, 2 * Math.PI);
    if (this.context.isPointInPath(mouseX, mouseY)) {
      returnValue = true;
    }
    this.context.closePath();
    return returnValue;
  }

  private focusOnStar(redo: boolean = true) {
    setTimeout(() => {
      this.focusOn(this.data.star.value, false);
      if (redo) {
        this.focusOnStar(false);
      }
    }, 100);
  }

}
