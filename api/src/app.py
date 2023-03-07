# app.py

import pickle
import pandas as pd
from flask import Flask, request
from flask import Flask
from flask_cors import CORS
from ast import literal_eval
import os
app = Flask(__name__)
CORS(app)

import openai
openai.organization = os.environ.get('OPENAI_ORG')
openai.api_key = os.environ.get('OPENAI_KEY')

GENERATE_COCKTAIL_PROMPT_PREFIX = """

Here is an example of a drink recipe in properly formatted JSON:

'{"name": "Bald Eagle","ingredients": ["2 fl oz of Reposado Tequila","3/4 fl oz of Grapefruit Juice","1/2 fl oz of Cranberry Juice", "1/4 fl oz of Lemon Juice", "1/4 fl oz of Simple Syrup"],"directions": "Throw all ingredients with ice and strain into chilled glass", "serving_container": "couple glass"}'

Format your response as properly formatted JSON like in the example above with no unnecessary white spaces or newlines. Now make a new recipe only the following ingredients: 
"""

GENERATE_COCKTAIL_IMAGE_PROMPT_PREFIX = "a clear, bright picture of a cocktail named {name} served in an {serving_container} and made with {ingredients}; cocktail should take up half the image; cocktail should be centered; white background"

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

@app.route('/generate_cocktail', methods=['GET','POST'])
def generate_cocktail():
    ing_list = request.json['ingredients']
    print(', '.join(ing_list)[:-1])
    # ing_list = ['scotch whiskey', 'lime juice', 'egg', 'white wine']
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=GENERATE_COCKTAIL_PROMPT_PREFIX + ', '.join(ing_list)[:-2],
        temperature=0.5,
        max_tokens=400,
        top_p=1,
        frequency_penalty=1,
        presence_penalty=1
    )

    print('RECIPE RESPONSE', response)
    cocktail = literal_eval(literal_eval("'{" + response['choices'][0]['text'].strip().split('{')[1]))
    response = openai.Image.create(
        prompt=GENERATE_COCKTAIL_IMAGE_PROMPT_PREFIX.format(name=cocktail['name'], serving_container=cocktail['serving_container'], ingredients=', '.join(cocktail['ingredients'])),
        n=1,
        size="1024x1024"
    )

#     completion = openai.ChatCompletion.create(
#   model="gpt-3.5-turbo", 
#   messages=[{"role": "user", "content": "Tell the world about the ChatGPT API in the style of a pirate."}]
# )

# print(completion)
    image_url = response['data'][0]['url']
    print('RECIPE IMAGE', response)
    cocktail['image_url'] = image_url
    return {'cocktails':[cocktail]}

# We only need this for local development.
if __name__ == '__main__':
 app.run(debug=True)
