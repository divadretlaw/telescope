import { Line } from "./line"

export class Star {
    x: number
    y: number
    radius: number

    line: Line

    constructor(x: number, y: number, length: number, width: number) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.line = new Line(length, width);
    }
}
