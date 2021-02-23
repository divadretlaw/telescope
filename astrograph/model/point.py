class Point:
    x: int
    y: int
    radius: int

    def __init__(self, x: int, y: int, radius: int = 0):
        self.x = x
        self.y = y
        self.radius = radius

    def string(self):
        return f'{self.x},{self.y},{self.radius}'

    def dictionary(self):
        return {"x": self.x, "y": self.y, "radius": self.radius}
