export class ChartData {
    label: string
    data: any[]
    show: boolean
    color: string

    constructor(label: string, color: string) {
        this.label = label;
        this.data = [];
        this.show = true;
        this.color = color;
    }

    getDataset() {
        return { label: this.label, data: this.data, fill: false, borderColor: this.color }
    }
}
