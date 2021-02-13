from flask import Flask
from flask import render_template

app = Flask(__name__, static_folder='static', template_folder='static')

@app.route('/hello')
def hello_world():
    return 'Hello, World!'

@app.route('/')
def home():
    return render_template('index.html')