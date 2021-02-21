from model.data import Data


class RGB:
    red: Data
    green: Data
    blue: Data

    def __init__(self, red: Data, green: Data, blue: Data):
        self.red = red
        self.green = green
        self.blue = blue

    def string(self):
        return f'{self.red.string()},{self.green.string()},{self.blue.string()}'

    def dictionary(self):
        return {
            "red": self.red.dictionary(),
            "green": self.green.dictionary(),
            "blue": self.blue.dictionary(),
        }

    def merge(self):
        average = (self.red.average + self.green.average + self.blue.average) / 3
        median = (self.red.median + self.green.median + self.blue.median) / 3
        minimum = (self.red.minimum + self.green.minimum + self.blue.minimum) / 3
        maximum = (self.red.maximum + self.green.maximum + self.blue.maximum) / 3
        return Data(self.red.index, average, median, minimum, maximum)
