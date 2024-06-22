import pandas as pd
import re
import string
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer

# Function to clean the text
def wordopt(text):
    text = text.lower()
    text = re.sub('\[.*?\]', '', text)
    text = re.sub("\\W", " ", text)
    text = re.sub('https?://\S+|www\.\S+', '', text)
    text = re.sub('<.*?>+', '', text)
    text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub('\n', '', text)
    text = re.sub('\w*\d\w*', '', text)
    return text

# Load the vectorizer
with open('vectorizer.pkl', 'rb') as file:
    vectorization = pickle.load(file)

# Load the logistic regression model
with open('logistic_regression_model.pkl', 'rb') as file:
    LR = pickle.load(file)

def output_label(n):
    if n == 0:
        return "Fake News"
    elif n == 1:
        return "Not Fake News"

def manual_testing(news):
    testing_news = {"text": [news]}
    new_def_test = pd.DataFrame(testing_news)
    new_def_test["text"] = new_def_test["text"].apply(wordopt)
    new_x_test = new_def_test["text"]
    new_xv_test = vectorization.transform(new_x_test)
    
    pred_LR = LR.predict(new_xv_test)
    print(output_label(pred_LR[0]))
    
    return print("\nPrediction: {}".format(output_label(pred_LR[0])))

# Example of calling the function with user input
news = str(input("Enter news text: "))
manual_testing(news)
