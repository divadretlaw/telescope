export class Scale {
    private index: number
    private scales: number[]

    constructor() {
        this.scales = [0.25, 0.5, 0.75, 1, 1.5, 2, 2.5];
        this.reset();
    }

    public factor() {
        return this.scales[this.index];
    }

    public inverseFactor() {
        let scaleFactor = 1 / this.factor();
        if (scaleFactor < 1) {
          scaleFactor = 1;
        }
        return scaleFactor
    }

    public canZoomIn() {
        return this.index < (this.scales.length - 1);
    }

    public zoomIn() {
        if (this.canZoomIn()) {
            this.index += 1;
        }
    }

    public canZoomOut() {
        return this.index > 0;
    }

    public zoomOut() {
        if (this.canZoomOut()) {
            this.index -= 1;
        }
    }

    public reset() {
        this.index = this.scales.indexOf(1);
    }
}
