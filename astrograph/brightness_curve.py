import io


def calculate(file, center_x, center_y, center_radius, star_x, star_y, star_length, star_width):
    """
    TODO: Implement method
    Load file
    calculate pixels path to read
    calculate neighbours of pixel
    calculate average, median, min, max
    """
    print(file)
    print(center_x)
    print(center_y)
    print(center_radius)
    print(star_x)
    print(star_y)
    print(star_length)
    print(star_width)
    csv = """
    0,5,5,8,6
    1,5,4,7,6
    2,5,4,6,6
    """
    return io.StringIO(csv)
