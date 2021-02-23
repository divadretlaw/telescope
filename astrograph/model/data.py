from model.point import Point


class Data:
    index: int
    average: float
    median: float
    minimum: float
    maximum: float
    origin: Point

    def __init__(self, index: int, average: float, median: float, minimum: float, maximum: float, origin: Point):
        self.index = index
        self.average = average
        self.median = median
        self.minimum = minimum
        self.maximum = maximum
        self.origin = origin

    def string(self):
        return f'{self.index};{self.average};{self.median};{self.minimum};{self.maximum};{self.origin.string()}'

    def dictionary(self):
        return {
            "index": self.index,
            "average": self.average,
            "median": self.median,
            "minimum": self.minimum,
            "maximum": self.maximum,
            "origin": self.origin.dictionary()
        }
