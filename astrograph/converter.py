import io
from PIL import Image


def convert(file):
    preview = io.BytesIO()
    image = Image.open(file)

    image.mode = 'I'
    image.point(lambda i: i * (1. / 256)).convert('L').save(preview, 'JPEG')

    # image.convert(mode='RGB')
    # image.save(preview, 'JPEG', optimze=True)
    return preview
