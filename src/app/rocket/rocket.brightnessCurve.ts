enum BrightnessCurveOption {
    JSON = 0,
    CSV = 1,
    JPEG = 2,
    JPEG_Preview = 100
}

export class BrightnessCurveOptions {
    public type: string;
    public fileExtension: string;
    public blobResponse: boolean;

    constructor(option: BrightnessCurveOption) {
        switch (option) {
        case BrightnessCurveOption.CSV:
            this.type = 'text/csv';
            this.fileExtension = '.csv';
            this.blobResponse = false;
            break;
        case BrightnessCurveOption.JPEG:
            this.type = 'image/jpeg';
            this.fileExtension = '.jpeg';
            this.blobResponse = true;
            break;
        case BrightnessCurveOption.JPEG_Preview:
            this.type = 'image/jpeg';
            this.fileExtension = '.jpeg';
            this.blobResponse = true;
            break;
        default:
            this.type = 'text/json';
            this.fileExtension = '.json';
            this.blobResponse = false;
            break;
        }
    }

    static csv: BrightnessCurveOptions = new BrightnessCurveOptions(BrightnessCurveOption.CSV);
    static jpeg: BrightnessCurveOptions = new BrightnessCurveOptions(BrightnessCurveOption.JPEG);
    static json: BrightnessCurveOptions = new BrightnessCurveOptions(BrightnessCurveOption.JSON);
    static preview: BrightnessCurveOptions = new BrightnessCurveOptions(BrightnessCurveOption.JPEG_Preview);
}
