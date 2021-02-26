import { Copyable } from "./copyable";
import { Equatable } from "./equatable"

export class Line implements Equatable<Line>, Copyable<Line> {
    width: number
    length: number

    constructor(length: number, width: number) {
        this.length = length;
        this.width = width;
    }

    public equals(line: Line): boolean {
        if (this.width !== line.width) { return false; }
        if (this.length !== line.length) { return false; }
        return true;
    }
    
    public copy(): Line {
        return new Line(this.length, this.width);
    }

    public copyFrom(data: Line) {
        this.width = data.width;
        this.length = data.length;
    }
}