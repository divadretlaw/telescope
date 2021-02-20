class Line:
    length: int
    width: int

    def __init__(self, length: int, width: int):
        self.length = length
        self.width = width

    def dictionary(self):
        return {"length": self.length, "width": self.width}
