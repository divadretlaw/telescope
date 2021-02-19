from model.point import Point
from model.line import Line


class Star(Point):
    x: int
    y: int
    line: Line

    def __init__(self, x: int, y: int, length: int, width: int):
        Point.__init__(self, x, y, 0)

        self.x = x
        self.y = y
        self.line = Line(length, width)
