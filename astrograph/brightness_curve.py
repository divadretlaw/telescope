import io
import json
import rawpy

from io import BytesIO
from PIL import Image
from statistics import mean, median

from model.data import Data
from model.point import Point
from model.star import Star

import numpy


class BrightnessCurve:
    file: BytesIO
    reference: Point
    star: Star
    data: [Data]

    def __init__(self, file: BytesIO, raw: bool, reference: Point, star: Star):
        self.file = file
        self.reference = reference
        self.star = star
        self.data = []

        if raw:
            self.raw_image = rawpy.imread(self.file)
            # image = Image.open(self.file)
            self.raw_data = self.raw_image.postprocess(gamma=(1, 1), no_auto_bright=True, output_bps=16)
        else:
            image = Image.open(self.file)
            self.raw_data = numpy.asarray(image)
        print(self.raw_data)

    def dictionary(self):
        return {
            "center": self.reference.dictionary(),
            "star": self.star.dictionary(),
            "data": list(map(lambda x: x.dictionary(), self.data))
        }

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

    def json(self):
        return json.dumps(self.dictionary())

    def calculate(self):
        # TODO: calculate pixels path to read
        path = []
        for i in range(100):
            path.append((i, i))

        for index, path in enumerate(path):
            self.data.append(self.calculate_for(index, path[0], path[1]))

        self.raw_image.close()

    def calculate_for(self, index, x, y):
        value = self.raw_data[x][y]
        # TODO: Get Neighbours within radius self.star.width
        # Fix for RGB images
        print(value)
        if isinstance(value, numpy.ndarray):
            value = value[0]

        neighbours = [value]
        min_value = min(neighbours)
        max_value = max(neighbours)
        average_value = mean(neighbours)
        median_value = median(neighbours)

        return Data(index, float(average_value), float(median_value), float(min_value), float(max_value))
