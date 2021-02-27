import io
import json
import imageio
import logging
from flask import Flask, flash, request, redirect, Response, send_file

from brightness_curve import BrightnessCurve
from model.point import Point
from model.star import Star
from converter import convert_tiff, convert_raw
from base64 import b64decode

ALLOWED_EXTENSIONS = {'tiff', 'cr2'}

app = Flask(__name__)

logging.basicConfig(format='[%(asctime)s] %(levelname)-5s in %(module)s: %(message)s',
                    datefmt='%d/%m/%Y %H:%M:%S',
                    level=logging.DEBUG)


@app.after_request
def after_request(response):
    # allowed_origin = ['http://localhost:5000', 'http://localhost:4200', 'http://localhost']
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response


def get_file_extension(filename):
    return filename.rsplit('.', 1)[1].lower()


def allowed_file(filename):
    return '.' in filename and \
           get_file_extension(filename) in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET'])
def rocket():
    return "🚀"


@app.route('/status.gif', methods=['GET'])
def status():
    logging.debug("Check status")
    gif = io.BytesIO(b64decode("R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="))

    proxy = io.BytesIO()
    proxy.write(gif.getvalue())
    # seeking was necessary. Python 3.5.2, Flask 0.12.2
    proxy.seek(0)
    gif.close()

    return send_file(proxy, mimetype='image/gif', as_attachment=False, attachment_filename='status.gif')


@app.route('/brightness_curve', methods=['GET', 'POST'])
def astrograph_brightness_curve():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            logging.error("brightness_curve: no file attached")
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            logging.error("brightness_curve: empty or invalid file attached")
            return redirect(request.url)
        if file and allowed_file(file.filename):
            info = json.loads(request.form.get('parameters'))

            reference = Point(info['reference']['x'],
                              info['reference']['y'],
                              info['reference']['radius'])
            star = Star(info['star']['x'],
                        info['star']['y'],
                        info['star']['line']['length'],
                        info['star']['line']['width'])

            brightness_curve = BrightnessCurve(io.BytesIO(file.read()),
                                               get_file_extension(file.filename) != 'tiff',
                                               reference,
                                               star)
            logging.info("calculating...")
            brightness_curve.calculate()
            logging.info("calculating done.")

            if "preview" in info and info["preview"] is True:
                logging.debug("brightness_curve: returning debug image")
                jpeg = io.BytesIO()
                imageio.imwrite(jpeg, brightness_curve.raw_data, format="JPEG", quality=100, optimize=True)

                proxy = io.BytesIO()
                proxy.write(jpeg.getvalue())
                # seeking was necessary. Python 3.5.2, Flask 0.12.2
                proxy.seek(0)
                jpeg.close()

                return send_file(proxy,
                                 mimetype='image/jpeg',
                                 as_attachment=True,
                                 attachment_filename='result.jpeg')

            if "csv" in info and info["csv"] is True:
                logging.debug("brightness_curve: returning .csv")
                # return send_file(brightness_curve.csv())
                return Response(brightness_curve.csv(),
                                mimetype="text/csv",
                                headers={"Content-Disposition": "attachment;filename=test.csv"})
            else:
                logging.debug("brightness_curve: returning .json")
                return brightness_curve.json()
    return 'Invalid parameters.'


@app.route('/preview', methods=['POST'])
def preview_converter():
    if 'file' not in request.files:
        logging.error("preview_converter: no file attached")
        flash('No file part')
        return redirect(request.url)
    file = request.files['file']
    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        flash('No selected file')
        logging.error("preview_converter: empty or invalid file attached")
        return redirect(request.url)
    if file and allowed_file(file.filename):
        logging.debug("Reading image")
        data = io.BytesIO(file.read())

        logging.debug("Converting image")
        if get_file_extension(file.filename) == 'tiff':
            jpeg = convert_tiff(data)
        else:
            jpeg = convert_raw(data)

        proxy = io.BytesIO()
        proxy.write(jpeg.getvalue())
        # seeking was necessary. Python 3.5.2, Flask 0.12.2
        proxy.seek(0)
        jpeg.close()

        return send_file(proxy, mimetype='image/jpeg', as_attachment=True, attachment_filename='preview.jpeg')


def launch():
    app.run(host='127.0.0.1', port=40270)


if __name__ == "__main__":
    launch()
