import math
import numpy

from model.line import Line
from model.point import Point


def path(center: Point, start: Point, line: Line, max_width, max_height):
    x = float(start.x - center.x)
    y = float(start.y - center.y)

    radius = math.sqrt(math.pow(x, 2) + math.pow(y, 2))

    start_angle = math.acos(x / float(radius))
    arc = float(line.length) / float(radius)
    if y <= 0:
        start_angle *= -1
    end_angle = start_angle - arc

    result = []
    step = 0.0001
    for angle in numpy.arange(min(start_angle, end_angle), max(start_angle + step, end_angle + step), step):
        x = float(center.x) + float(radius) * math.cos(angle)
        y = float(center.y) + float(radius) * math.sin(angle)

        # print(x, y, angle)

        if 0 <= x < max_width and 0 <= y < max_height:
            point = Point(int(x), int(y))

            if not any(p.x == point.x and p.y == point.y for p in result):
                result.append(point)

    return result


def neighbours(point: Point, max_width, max_height):
    points = []

    min_x = max(0, point.x - point.radius)
    max_x = min(point.x + point.radius + 1, max_width)

    min_y = max(0, point.y - point.radius)
    max_y = min(point.y + point.radius + 1, max_height)

    for x in range(min_x, max_x):
        for y in range(min_y, max_y):
            x_axis = x - point.x
            y_axis = y - point.y
            if (x_axis * x_axis) + (y_axis * y_axis) < (point.radius * point.radius):
                points.append(Point(x, y))

    return points
