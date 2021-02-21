import io
import json

from flask import Flask, flash, request, redirect, Response, send_file

from brightness_curve import BrightnessCurve
from model.point import Point
from model.star import Star
from converter import convert_tiff, convert_raw

ALLOWED_EXTENSIONS = {'tiff', 'cr2'}

app = Flask(__name__)


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



@app.route('/brightness_curve', methods=['GET', 'POST'])
def astrograph_brightness_curve():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            info = json.loads(request.form.get('parameters'))
            # file_id = str(uuid.uuid4())
            # file_extension = os.path.splitext(file.filename)[1][1:].strip()
            # filename = file_id + '.' + file_extension
            # file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
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
            brightness_curve.calculate()

            if "csv" in info and info["csv"] is True:
                # return send_file(brightness_curve.csv())
                return Response(brightness_curve.csv(),
                                mimetype="text/csv",
                                headers={"Content-Disposition": "attachment;filename=test.csv"})
            else:
                return brightness_curve.json()
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''


@app.route('/preview', methods=['POST'])
def tiff_converter():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['file']
    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        data = io.BytesIO(file.read())

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
    app.run(host='127.0.0.1', port=5000)


if __name__ == "__main__":
    launch()
