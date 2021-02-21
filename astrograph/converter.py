import io
import rawpy
import imageio

from PIL import Image


def convert_tiff(file):
    preview = io.BytesIO()
    image = Image.open(file)

    # image.mode = 'I'
    # image.point(lambda i: i * (1. / 256)).convert('L').save(preview, 'JPEG')

    image.convert(mode='RGB').save(preview, 'JPEG', optimize=True)
    return preview


def convert_raw(file):
    preview = io.BytesIO()
    raw = rawpy.imread(file)
    rgb = raw.postprocess(use_camera_wb=True, no_auto_bright=True)
    imageio.imwrite(preview, rgb, format="JPEG")
    return preview

