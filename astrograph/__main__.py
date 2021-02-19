import click
import io

from model.point import Point
from model.star import Star

import brightness_curve


@click.command()
@click.option('--file', '-f', type=click.File('rb'))
@click.option('--center', '-c', type=(int, int, int))
@click.option('--star', '-s', type=(int, int, int, int))
def click_brightness_curve(file, center, star):
    """Simple program that prints the input variables"""
    click.echo(file.name)
    file_data = open(file.name, "rb").read()

    click.echo('(x: %d, y: %d) - radius: %d' % center)
    click.echo('(x: %d, y: %d) - length: %d, width: %d' % star)

    center_model = Point(center[0], center[1], center[2])
    star_model = Star(star[0], star[1], star[2], star[3])

    csv = brightness_curve.calculate_string(io.BytesIO(file_data), center_model, star_model)
    click.echo(csv)


if __name__ == '__main__':
    click_brightness_curve()
