import React from 'react'

const CocktailPage = ({cocktail}) => {
  return (
    <div key={cocktail.name} className="flex flex-col align-middle bg-white w-[100%] sm:w-[30%] p-3 duration-150 ease-in ">
            <div className="flex mb-3">
                <p className={`text-center px-2 rounded-xl ${cocktail.ing_percentage === 1 ? 'bg-green-300 text-green-700' : (cocktail.ing_percentage > 0.5 ? 'bg-yellow-300 text-yellow-700' : 'bg-red-300 text-red-700')}`}>
                    {cocktail.ing_hits.length} of {cocktail.ingredients.length} ingredients available
                </p>
            </div>
            <h1 className={'text-4xl'}>{cocktail.name.replace('\\\'', '\'')}</h1>
            <div className="flex justify-center align-middle">
                <img className="h-[45vh] object-contain" src={cocktail.image_url}/>
            </div>
            <div className="mb-3">
                <h2 className="text-xl">Ingredients</h2>
                {cocktail.ingredients.map((ingredient, ix) => {
                    return (
                        <p key={ingredient.name + "-ingredient-" + String(ix)} className="flex flex-row justify-between">
                            {ingredient.name}
                        </p>
                    )}
                )}
            </div>
            <div className="mb-3">
                <h2 className="text-xl">Directions</h2>
                <p>{cocktail.instructions}</p>
            </div>
            <div className="">
                <h2 className="text-xl">Serving Container</h2>
                <p>{cocktail.serving_container}</p>
            </div>
    </div>
  )
}

export default CocktailPage