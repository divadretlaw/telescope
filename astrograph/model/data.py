class Data:
    index: int
    average: float
    median: float
    minimum: float
    maximum: float

    def __init__(self, index: int, average: float, median: float, minimum: float, maximum: float):
        self.index = index
        self.average = average
        self.median = median
        self.minimum = minimum
        self.maximum = maximum

    def string(self):
        return f'{self.index},{self.average},{self.median},{self.minimum},{self.maximum}'

    def dictionary(self):
        return {
            "index": self.index,
            "average": self.average,
            "median": self.median,
            "minimum": self.minimum,
            "maximum": self.maximum
        }
