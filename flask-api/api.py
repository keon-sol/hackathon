from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import sys

app = Flask(__name__)

CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/analyze', methods=['POST'])
@cross_origin()
def analyze_text():
    print("hello", file=sys.stderr)
    content = request.json
    data = content["data"]
    print(data, file=sys.stderr)
    return jsonify ({
        "status": "OK",
    })