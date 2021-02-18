import { Copyable } from "./copyable";
import { Equatable } from "./equatable";

export class Updateable<T extends Equatable<T> & Copyable<T>> {
    value: T
    oldValue: T

    constructor(value: T, oldValue: T) {
        this.value = value;
        this.oldValue = oldValue;
    }

    public didChange(): boolean {
        return !this.value.equals(this.oldValue)
    }

    public update() {
        this.oldValue = this.value.copy();
    }
}