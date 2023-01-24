# app.py

import pickle
import pandas as  pd
from flask import Flask, request
from  flask_cors import CORS
import os
app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
 return '<h1>SHE LIVES</h1>'

@app.route('/ingredients', methods=['GET'])
def ingredients():
    ingredient = [('image_url','https://www.thecocktaildb.com/images/ingredients/Vodka-Medium.png'),('title','vodka')]
    return {'ingredients':[dict(ingredient + [('id', ix)]) for ix in range(10)], 'path':os.getcwd()}

@app.route('/recommend_cocktails', methods=['POST'])
def recommend_cocktails():
    ing_list = request.json['ingredients']
    ing_to_filter = set(request.json['ingredients'])
    cdf = pickle.load(open(os.path.join(os.path.dirname(__file__), './cocktails_db.pkl'), 'rb'))

    cdf['ing_hits'] = cdf.ingredient_categories.map(lambda x: [y for y in x if y in ing_list])
    cdf['ing_percentage'] = cdf.ing_hits.map(lambda x: float(len(x))) / cdf.num_ingredients
    cdf['ing_percentage'] = cdf.ing_percentage.map(lambda x: int(x*100)/100.0)
    cdf = cdf.sort_values('ing_percentage', ascending=False)
    return {'cocktails':cdf.to_dict(orient='records')[:20]}




# We only need this for local development.
if __name__ == '__main__':
 app.run()
