import { Copyable } from "./copyable"
import { Equatable } from "./equatable"

export class Point implements Equatable<Point>, Copyable<Point> {
    x: number
    y: number
    radius: number
    color: string

    constructor(x: number, y: number, radius: number, color: string = '#FC6A5D') {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    public equals(point: Point): boolean {
        if (this.x !== point.x) { return false; }
        if (this.y !== point.y) { return false; }
        if (this.radius !== point.radius) { return false; }
        if (this.color !== point.color) { return false; }
        return true;
    }

    public copy(): Point {
        return new Point(this.x, this.y, this.radius, this.color);
    }
}
