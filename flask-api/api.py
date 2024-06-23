from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import pandas as pd
import re
import string
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from news_classifier import manual_testing
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
app.config['OPENAI_API_KEY'] = os.environ.get('OPENAI_API_KEY')
CORS(app)

print(os.environ.get('OPENAI_API_KEY'), file=sys.stderr)

# Set your OpenAI API key here
client = OpenAI()

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/analyze', methods=['POST'])
def analyze_text():
    content = request.json
    data = content["data"]
    currURL = content["currURL"]

    # Create the OpenAI completion request
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a news reporter who is very skilled at reading, analyzing, and summarizing news articles."},
            {"role": "user", "content": f"Write a 1000 word summary of the news article from the URL: {currURL}"}
        ]
    )

    openai_response = completion.choices[0].message
    print(openai_response.content, file=sys.stderr)

    # Pass the resulting text from OpenAI call into manual_testing
    # result = manual_testing(openai_response.content)
    result = manual_testing(data)

    return jsonify({
        "result": result,
    })

if __name__ == "__main__":
    app.run(debug=True)
