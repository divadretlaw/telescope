import json
import io

from flask import Flask, flash, request, redirect, Response
from flask import render_template

from model.point import Point
from model.star import Star

import brightness_curve

ALLOWED_EXTENSIONS = {'tiff', 'jpeg', 'jpg'}

app = Flask(__name__, static_folder='static', template_folder='static')


@app.after_request
def after_request(response):
    # allowed_origin = ['http://localhost:5000', 'http://localhost:4200', 'http://localhost']
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/brightness_curve', methods=['GET', 'POST'])
def astrograph_brightness_curve():
    if request.method == 'POST':
        print(request)
        print(request.files)
        print(request.form)
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
            reference = Point(info['reference']['x'], info['reference']['y'], info['reference']['radius'])
            star = Star(info['star']['x'], info['star']['y'], info['star']['line']['length'],
                        info['star']['line']['width'])
            csv = brightness_curve.calculate_csv(io.BytesIO(file.read()), reference, star)

            return Response(csv,
                            mimetype="text/csv",
                            headers={"Content-Disposition": "attachment;filename=test.csv"})
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''


def launch():
    app.run(host='127.0.0.1', port=5000)


if __name__ == "__main__":
    launch()
