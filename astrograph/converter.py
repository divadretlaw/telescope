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

    if rawpy.DemosaicAlgorithm.AMAZE.isSupported:
        demosaic_algorithm = rawpy.DemosaicAlgorithm.AMAZE
    elif rawpy.DemosaicAlgorithm.DCB.isSupported:
        demosaic_algorithm = rawpy.DemosaicAlgorithm.DCB
    else:
        demosaic_algorithm = rawpy.DemosaicAlgorithm.AHD

    rgb = raw.postprocess(demosaic_algorithm=demosaic_algorithm,
                          use_camera_wb=True,
                          no_auto_bright=True,
                          output_bps=8,
                          median_filter_passes=1)
    imageio.imwrite(preview, rgb, format="JPEG", optimize=True)
    return preview
