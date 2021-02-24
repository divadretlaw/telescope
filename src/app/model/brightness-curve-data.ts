import { Point } from "./point";
import { Star } from "./star";
import { Updateable } from "./updateable";

export class BrightnessCurveData {
    file: File;
    image: HTMLImageElement;
  
    reference: Updateable<Point>
    star: Updateable<Star>;

    json: any;

    constructor() {
        this.file = null;
        this.image = null;

        this.reference = new Updateable(new Point(100, 100, 2), new Point(-1, -1, -1));
        this.star = new Updateable(new Star(200, 200, 100, 2), new Star(-1, -1, -1, -1));

        this.json = null;
    }
}