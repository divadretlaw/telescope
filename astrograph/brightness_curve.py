import io

from model.data import Data
from model.point import Point
from model.star import Star

from PIL import Image

import numpy


class Result:
    reference: Point
    star: Star
    data: [Data]

    def __init__(self, reference: Point, star: Star):
        self.reference = reference
        self.star = star
        self.data = []

    def string(self):
        result = """
Center, {center_x}, {center_y}, {center_radius}
Star, {star_x}, {star_y}, {star_radius}, {star_length}

index,average,median,min,max
""".format(center_x=self.reference.x,
           center_y=self.reference.y,
           center_radius=self.reference.radius,
           star_x=self.star.x,
           star_y=self.star.y,
           star_radius=self.star.line.width,
           star_length=self.star.line.length)
        for data in self.data:
            result += data.string() + "\n"
        return result

    def csv(self):
        csv = self.string()
        return io.StringIO(csv)


def calculate(file, center: Point, star: Star):
    """
    TODO: Implement method
    Load file
    calculate pixels path to read
    calculate neighbours of pixel
    calculate average, median, min, max
    """
    image = Image.open(file)
    data = numpy.asarray(image)
    print(data)

    result = Result(center, star)
    result.data.append(Data(0, 56, 55, 40, 76))
    result.data.append(Data(1, 57, 56, 38, 72))
    result.data.append(Data(2, 59, 57, 41, 70))
    result.data.append(Data(3, 60, 56, 42, 72))
    return result


def calculate_csv(file, center: Point, star: Star):
    result = calculate(file, center, star)
    return result.csv()


def calculate_string(file, center: Point, star: Star):
    result = calculate(file, center, star)
    return result.string()


def calculate_json(file, center: Point, star: Star):
    """
    TODO: Implement method, now just returns same as string
    """
    result = calculate(file, center, star)
    return result.string()
