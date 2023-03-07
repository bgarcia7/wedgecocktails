import React from 'react'

function arrayToString(array, quantity=false) {
    var string = '';
    for (var i = 0; i < array.length; i++) {
        string += quantity ? array[i].quantity + ' of ' : '' + array[i].name + ' • ';
    }
    return string.slice(0, -2);
}

const CocktailList = ({cocktails, generateCocktail, genCocktail, setActiveCocktailID}) => {
    console.log('generated cocktails', genCocktail)
  return (
    <>
    { cocktails?.length ?  
        <div className="h-[100%] flex flex-row flex-wrap flex-grow-0 overflow-scroll justify-center mt-4 pb-16">
            {/* Generate Cocktail Button */}
            <button
            className={`my-2 text-white ring-indigo-600 hover:bg-indigo-700 bg-indigo-600 inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 shadow-sm ring-1 hover:cursor-pointer w-[95%]`}
            onClick={generateCocktail}
            >
                Generate Cocktail with OpenAI
            </button>
            {genCocktail?.length ?
                <div key={genCocktail[0].name} className="flex flex-col align-middle bg-white w-[100%] sm:w-[30%] p-3 duration-150 ease-in ring-1 ring-gray-100 m-2 p-6  rounded-lg shadow-sm duration-150 ease-in hover:ease-out hover:-translate-y-0.5 hover:shadow-md hover:cursor-pointer">
                <h1 className={'text-4xl'}>{genCocktail[0].name.replace('\\\'', '\'')}</h1>
                <div className="flex justify-center align-middle rounded-full object-contain bg-url(">
                    <img className="h-[45vh] object-contain" src={genCocktail[0].image_url}/>
                </div>
                <div className="mb-3">
                    <h2 className="text-xl">Ingredients</h2>
                    {genCocktail[0].ingredients.map((ingredient, ix) => {
                        return (
                            <p key={"gencocktail-ingredient-" + String(ix)} className="flex flex-row justify-between">
                                {ingredient}
                            </p>
                        )}
                    )}
                </div>
                <div className="mb-3">
                    <h2 className="text-xl">Directions</h2>
                    <p>{genCocktail[0].directions}</p>
                </div>
                <div className="">
                    <h2 className="text-xl">Serving Container</h2>
                    <p>{genCocktail[0].serving_container}</p>
                </div>
            </div>: null}

            {/* Cocktail List */}
            {cocktails.map((cocktail, ix) => (
                <div 
                    key={cocktail.name} 
                    onClick={() => setActiveCocktailID(cocktail.objectID)}
                    className="flex flex-col align-middle justify-top overflow-hidden bg-white h-[max-30vh] ring-1 ring-gray-100 rounded-lg shadow-lg w-[45%] sm:w-[25%] m-2 p-4 rounded-lg shadow-sm duration-150 ease-in hover:ease-out hover:-translate-y-0.5 hover:shadow-md hover:cursor-pointer">
                    <div className="text-clip flex flex-col align-center">
                            <div className="flex justify-end">
                                <p className={`text-center px-2 rounded-xl ${cocktail.ing_percentage === 1 ? 'bg-green-300 text-green-700' : (cocktail.ing_percentage > 0.5 ? 'bg-yellow-300 text-yellow-700' : 'bg-red-300 text-red-700')}`}>
                                {cocktail.ing_hits.length} of {cocktail.ingredients.length}
                            </p>
                            </div>
                            <div className="h-[25vh]">
                                <img className="object-contain" src={cocktail.image_url}/>
                            </div>
                                <p>{cocktail.name.replace('\\\'', '\'')}</p>
                            <p className="text-sm">
                                {arrayToString(cocktail.ingredients)}
                            </p>
                            {/* <p className="text-sm">
                                {cocktail.serving_container}
                            </p> */}
                            {/* PERCENT OF INGREDIENT HITS AND INSTRUCTIONS */}
                                {/* <p margin="10px 0px 0px 0px;">{String(cocktail.ing_percentage * 100) + '% of ingredients available'}</p> */}
                            {/* <div className="w-[33%]">
                                <h2>Directions</h2>
                                <p margin="10px 0px; ">{cocktail.instructions}</p>
                            </div> */}
                        </div>
                </div>))}

            </div> : null}
    </>
  )
}

export default CocktailList