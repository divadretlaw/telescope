from model.point import Point
from model.line import Line


class Star(Point):
    x: int
    y: int
    line: Line

    def __init__(self, x: int, y: int, length: int, width: int):
        Point.__init__(self, x, y, 5)

        self.x = x
        self.y = y
        self.line = Line(length, width)

    def dictionary(self):
        return {"x": self.x, "y": self.y, "line": self.line.dictionary()}
