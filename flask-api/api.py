from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import sys
import pandas as pd
import re
import string
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from news_classifier import manual_testing

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
    result = manual_testing(data)
    print(result, file=sys.stderr)
    return jsonify({
        "result": result,
    })

if __name__ == "__main__":
    app.run(debug=True)