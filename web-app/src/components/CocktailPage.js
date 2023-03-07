import React from 'react'
import { styles } from '../styles'

const CocktailPage = ({cocktail}) => {
  console.log('COCKTAIL PAGE: ', cocktail)
  return (
    <div key={cocktail.name} className="flex flex-col align-middle w-[100%] sm:w-[70%] sm:mx-[15%] p-3 duration-150 ease-in overflow-scroll">
            <h1 className={`${styles.pageTitle} mb-2 mt-12`}>{cocktail.name.replace('\\\'', '\'')}</h1>
            <div className="flex">
                <p className={`${styles.pageBody} text-center px-2 rounded-xl ${cocktail.ing_percentage === 1 ? 'bg-green-300 text-green-700' : (cocktail.ing_percentage > 0.5 ? 'bg-yellow-300 text-yellow-700' : 'bg-red-300 text-red-700')}`}>
                    {cocktail.ing_hits.length} of {cocktail.ingredients.length} ingredients available
                </p>
            </div>
            <div className="flex justify-center align-middle">
                <img className="h-[45vh] object-contain" src={cocktail.image_url}/>
            </div>
            <div className="mb-3">
                <h2 className={`${styles.pageSubTitle}`}>Ingredients</h2>
                {cocktail.ingredients.map((ingredient, ix) => {
                    return (
                        <p key={ingredient.name + "-ingredient-" + String(ix)} className={`flex flex-row justify-between ${styles.pageBody}`}>
                           {ingredient.quantity} of {ingredient.name}
                        </p>
                    )}
                )}
            </div>
            <div className="mb-3">
                <h2 className={`${styles.pageSubTitle}`}>Directions</h2>
                <p className={`${styles.pageBody}`}>{cocktail.instructions}</p>
            </div>
            <div className="">
                <h2 className={`${styles.pageSubTitle}`}>Serving Container</h2>
                <p className={`${styles.pageBody}`}>{cocktail.serving_container}</p>
            </div>
    </div>
  )
}

export default CocktailPage