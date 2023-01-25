import re
import requests
import shutil

def preprocess(string):
    return re.sub('[^a-zA-z0-9 ]', '', string).lower()

def name_to_id(name):
    return preprocess(name).replace(' ', '-')

def download_img(url, file_name):
    
    res = requests.get(url, stream = True)
    if res.status_code == 200:
        with open(file_name,'wb') as f:
            shutil.copyfileobj(res.raw, f)
        print('Image sucessfully Downloaded: ',file_name)
    else:
        print('Image Couldn\'t be retrieved')
