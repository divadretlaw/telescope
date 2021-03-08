import math
import numpy

from model.line import Line
from model.point import Point


def path(center: Point, start: Point, line: Line, max_width: int, max_height: int):
    """
    Calculate the path from start with distance of line on the arc from center
    """
    x = float(start.x - center.x)
    y = float(start.y - center.y)

    radius = math.sqrt(math.pow(x, 2) + math.pow(y, 2)) + 1

    start_angle = math.acos(x / radius)
    arc = float(line.length) / radius
    if y <= 0:
        start_angle *= -1
    end_angle = start_angle - arc

    result = []
    # minimum step for start to end angle
    step = min_step(max_width, max_height)
    # calculate X and Y for each angle between start and end angle
    for angle in numpy.arange(min(start_angle, end_angle), max(start_angle, end_angle), step):
        x = float(center.x) + radius * math.cos(angle)
        y = float(center.y) + radius * math.sin(angle)

        # check if point is inside the canvas
        if 0 <= x < max_width and 0 <= y < max_height:
            point = Point(int(x), int(y))

            # add the point to the list if not already present
            if not any(p.x == point.x and p.y == point.y for p in result):
                result.append(point)

    # list is in clockwise but we assume counter-clockwise so we reverse it
    result.reverse()
    return result


def min_step(max_width: int, max_height: int):
    """
    Attempt to calculate a minimum step for the angle
    """
    x = max_width - 2
    y = max_height - 2

    radius = math.sqrt(math.pow(x, 2) + math.pow(y, 2))
    angle = math.acos(x / radius)

    steps = []
    for x in range(x - 1, x + 2):
        for y in range(y - 1, y + 2):
            radius = math.sqrt(math.pow(x, 2) + math.pow(y, 2))
            step = abs(math.acos(x / radius) - angle)
            if step > 0.000000001:
                steps.append(step)

    if len(steps) > 0:
        return min(steps)
    else:
        return 0.0001


def neighbors(point: Point, max_width, max_height):
    """
    Calculate all neighboring points of the given point within the points radius
    """
    points = []

    min_x = max(0, point.x - point.radius)
    max_x = min(point.x + point.radius + 1, max_width)

    min_y = max(0, point.y - point.radius)
    max_y = min(point.y + point.radius + 1, max_height)

    radius = point.radius

    # check all points in the square
    for x in range(min_x, max_x):
        for y in range(min_y, max_y):
            x_axis = x - point.x
            y_axis = y - point.y
            # check if the point is inside the circle
            if (x_axis * x_axis) + (y_axis * y_axis) <= (radius * radius):
                points.append(Point(x, y))

    return points
