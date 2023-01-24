import re

def preprocess(string):
    return re.sub('[^a-zA-z0-9 ]', '', string).lower()

def name_to_id(name):
    return preprocess(name).replace(' ', '-')
