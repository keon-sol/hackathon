from flask import Flask, jsonify, request, Response
from flask_cors import CORS, cross_origin
import sys

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/analyze', methods=['POST'])
def analyze_text():
    print("hello", file=sys.stderr)
    content = request.json
    data = content["data"]
    print(data, file=sys.stderr)
    return jsonify ({
        "status": "OK",
    })