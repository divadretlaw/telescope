import io
import json
import rawpy
import numpy
import logging

from io import BytesIO
from PIL import Image
from statistics import mean, median

from model.rgb import RGB
from model.data import Data
from model.point import Point
from model.star import Star

import points


class BrightnessCurve:
    version = '0.9.0'
    file: BytesIO
    reference: Point
    star: Star
    data: [Data] or [RGB]

    def __init__(self, file: BytesIO, is_raw: bool, reference: Point, star: Star):
        logging.info("__init__")
        self.file = file
        self.is_raw = is_raw

        self.reference = reference
        self.star = star

        self.data = []

        if is_raw:
            logging.info("Parsing RAW image")
            raw_image = rawpy.imread(self.file)
            sizes = raw_image.sizes
            self.width = sizes.width
            self.height = sizes.height
            logging.info("Postprocess image")

            if rawpy.DemosaicAlgorithm.AMAZE.isSupported:
                logging.info("Demosaic Algorithm: AMAZE")
                demosaic_algorithm = rawpy.DemosaicAlgorithm.AMAZE
            elif rawpy.DemosaicAlgorithm.DCB.isSupported:
                logging.info("Demosaic Algorithm: DCB")
                demosaic_algorithm = rawpy.DemosaicAlgorithm.DCB
            elif rawpy.DemosaicAlgorithm.VNG.isSupported:
                logging.info("Demosaic Algorithm: VNG")
                demosaic_algorithm = rawpy.DemosaicAlgorithm.VNG
            else:
                logging.info("Demosaic Algorithm: AHD")
                demosaic_algorithm = rawpy.DemosaicAlgorithm.AHD

            self.raw_data = raw_image.postprocess(demosaic_algorithm=demosaic_algorithm,
                                                  gamma=(1, 1),
                                                  no_auto_bright=True,
                                                  use_camera_wb=True)
            self.raw_image = raw_image
        else:
            logging.info("Parsing TIFF image")
            image = Image.open(self.file)
            raw_image = numpy.asarray(image)
            self.width = len(raw_image[0])
            self.height = len(raw_image)
            self.raw_data = raw_image

        # print(self.raw_data)

    def dictionary(self):
        return {
            "type": 'brightnessCurve',
            "version": self.version,
            "center": self.reference.dictionary(),
            "star": self.star.dictionary(),
            "data": list(map(lambda entry: entry.dictionary(), self.data))
        }

    def string(self):
        result = """
BrightnessCurve;version;{version}
Center;{center_x};{center_y};{center_radius}
Star;{star_x};{star_y};{star_radius};{star_length}

index;average;median;min;max;origin
""".format(version=self.version,
           center_x=self.reference.x,
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
        logging.debug("calculate")
        path = points.path(self.reference, self.star, self.star.line, self.width, self.height)
        logging.debug("calculated path=%d" % len(path))

        for index, entry in enumerate(path):
            data = self.calculate_for(index, entry.x, entry.y)
            self.data.append(data)

        if self.is_raw:
            # DEBUG: Draw the reference in green
            for point in points.neighbors(self.reference, self.width, self.height):
                self.raw_data[point.y][point.x] = [0, 255, 0]

            # DEBUG: Draw the star in red
            for index, entry in enumerate(path):
                origin = Point(entry.x, entry.y, self.star.line.width)
                for point in points.neighbors(origin, self.width, self.height):
                    self.raw_data[point.y][point.x] = [255, 0, 0]

            # DEBUG: Draw the path in yellow
            for index, entry in enumerate(path):
                self.raw_data[entry.y][entry.x] = [255, 255, 0]

            # DEBUG: Draw the start in blue
            for point in points.neighbors(self.star, self.width, self.height):
                self.raw_data[point.y][point.x] = [0, 0, 255]

            self.raw_image.close()

    def calculate_for(self, index, x, y):
        origin = Point(x, y, self.star.line.width)
        neighbors = []
        for point in points.neighbors(origin, self.width, self.height):
            value = self.raw_data[point.y][point.x]
            if isinstance(value, numpy.ndarray):
                neighbors.append(mean(value))
            else:
                neighbors.append(value)

        min_value = min(neighbors)
        max_value = max(neighbors)
        average_value = mean(neighbors)
        median_value = median(neighbors)

        return Data(index, float(average_value), float(median_value), float(min_value), float(max_value), origin)
