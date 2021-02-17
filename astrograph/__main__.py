import click


@click.command()
@click.option('--file', '-f', type=click.File('rb'))
@click.option('--center', '-c', type=(int, int, int))
@click.option('--star', '-s', type=(int, int, int))
@click.option('--distance', '-d', type=int)
def brightness_curve(file, center, star, distance):
    """Simple program that prints the input variables"""
    click.echo(file.name)

    click.echo('(x: %d, y: %d) - radius: %d' % center)
    click.echo('(x: %d, y: %d) - radius: %d' % star)
    click.echo("distance: %d" % distance)
    csv = brightness_curve(file, center[0], center[1], center[2], star[0], star[1], distance, star[2])
    click.echo(csv)


if __name__ == '__main__':
    brightness_curve()
