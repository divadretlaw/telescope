import { Line } from "./line"
import { Point } from "./point"
import { Equatable } from "./equatable"
import { Copyable } from "./copyable";

export class Star extends Point implements Equatable<Star>, Copyable<Star> {
    line: Line

    constructor(x: number, y: number, length: number, width: number, color: string = '#74B6F6') {
        super(x, y, 10, color);
        this.line = new Line(length, width);
    }

    public equals(star: Star): boolean {
        if (!super.equals(star)) { return false; }
        if (!this.line.equals(star.line)) { return false; }
        return true;
    }

    public copy(): Star {
        return new Star(this.x, this.y, this.line.length, this.line.width, this.color)
    }
}
