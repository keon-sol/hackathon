import pandas as pd
import numpy as np 
import seaborn as sns
import matplotlib.pyplot as plt 
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.metrics import classification_report
import re
import string

#imports data on what news is fake and what news is real
data_fake = pd.read_csv('Fake.csv')
data_true = pd.read_csv('True.csv')
data_fake.head()
data_true.head()

#classifying fake and real news
data_fake["class"] = 0
data_true['class'] = 1

#checks number of rows and columns in the data set
data_fake.shape, data_true.shape

#manually tests data (?)
data_fake_manual_testing = data_fake.tail(10)
for i in range(23480, 23470, -1):
    data_fake.drop([i], axis = 0, inplace = True)
data_true_manual_testing = data_true.tail(10)
for i in range(21416, 21406, -1):
    data_true.drop([i], axis = 0, inplace = True)

#classifies data set
data_fake_manual_testing['class'] = 0
data_true_manual_testing['class'] = 1

#merges the fake and true news data sets into one
data_merge = pd.concat([data_fake, data_true], axis = 0)
data_merge.head(10)

#gets rid of irrelevant columns
data = data_merge.drop(['title', 'subject', 'date'], axis = 1)

#cleaning text
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

#applying function to text column and assigning x/y (?)
data['text'] = data['text'].apply(wordopt)
x = data['text']
y = data['class']

#Defining Training and Testing Data and Splitting Them Into &5 -25 Percent Ratio (?)
x_train, x_test, y_train, t_test = train_test_split(x, y, test_size = 0.25)

#putting raw data into a matrix
from sklearn.feature_extraction.text import TfidfVectorizer

vectorization = TfidfVectorizer()
xv_train = vectorization.fit_transform(x_train)
xv_test = vectorization.transform(x_test)

#creaing regression model
from sklearn.linear_model import LogisticRegression

LR = LogisticRegression()
LR.fit(xv_train, y_train)

#checking model accuracy and classification report
pred_lr = LR.predict(xv_test)
LR.score(xv_test, y_test)
print(classification_report(y_test, pred_lr))

#creating decision tree classified model
from sklearn.tree import DecisionTreeClassifier

DT = DecisionTreeClassifier()
DT.fit(xv_train, y_train)

#checking model accuracy and classification report
pred_dt = DT.predict(xv_test)
DT.score(xv_test, y_test)
print(classification_report(y_test, pred_dt))

from sklearn.ensemble import GradientBoostingClassifier
GB = GradientBoostingClassifier(random_state = 0)
GB.fit(xv_train, y_train)

pred_gb = GB.predict(xv_test)

print(classification_report(y_test, pred_gb))

from sklearn.ensemble import RandomForestClassifier

RF = RandomForestClassifier(random_state = 0)
RF.fit(xv_train, y_train)

pred_rf = RF.predict(xv_test)

RF.score(xv_test, y_test)

print(classification_report(y_test, pred_rf))

def output_label(n):
    if n == 0:
        return "Fake News"
    elif n == 1:
        return "Not Fake News"

def manual_testing(news):
    testing_news = {"text":[news]}
    new_def_test = pd.DataFrame(testing_news)
    new_def_test["text"] = new_def_test["text"].apply(wordopt)
    new_x_test = new_def_test["text"]
    new_xv_test = vectorization.transform(new_x_test)
    pred_LR = LR.predict(new_xv_test)
    pred_DT = DT.predict(new_xv_test)
    
    return print("\n\nLR Prediction: {} \nDT Prediction:".format(output_label(pred_LR[0]), output_label(pred_DT[0])))

news = str(input())
manual_testing(news)