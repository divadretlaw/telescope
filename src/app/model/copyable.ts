export interface Copyable<T> {
    copy(): T
    copyFrom(data: T)
}