import { React, useEffect, useState } from 'react'
import { CocktailDisplay } from './'
import { BGGradients } from '../components'
import axios from 'axios'
import algoliasearch from 'algoliasearch/lite';
import {
    InstantSearch,
    Configure,
    SearchBox,
    RefinementList,
    Highlight,
    connectHits,
    Pagination,
    ScrollTo
  } from "react-instantsearch-dom";
const searchClient = algoliasearch(
    'XDZGBI1FCU',
    'accb47948bbc928311f5b97d9c18ea5a'
);
import { X } from 'react-feather'
// const index = searchClient.initIndex('ingredients');

// TODO -
// WEB-APP
// [x] make selected ingredients disappear from list
// [x] put cocktail recommendations on separate next page with back + generate ai cocktail button
// [x] create cocktail quickview 
// [x] make ingredient selection home page
// [x] redeploy zappa and hook up to prod back-end (20 min, 14 min)
// [x] hook up openAI cocktail generation (20 min)
// [x] Desktop cleanup (cocktail list, see cocktails CTA) (20 min)
// [HOLD] ingredient select on enter with direct hit (10 min)
// [x] style cocktail page (+desktop) (20 min)
// [x] full cocktail counts (5 min)
// [x] gradient bg implementation (20 min)
// [ ] refactor cocktail page into route (TBD)
// [ ] add route support for ingredient search page (1 hour)
// DATA
// [ ] manually let order

const IngredientSearch = ({initialData}) => {
    let [cocktails, setCocktails] = useState(initialData)
    let [cocktailStats, setCocktailStats] = useState(initialData)
    let [genCocktail, setGenCocktail] = useState([])
    let [genIsLoading, setGenIsLoading] = useState(false)
    let [cocktailDrawerOpen, setCocktailDrawerOpen] = useState(false)
    const [ingredientsCache, setIngredientsCache] = useState({})
    const [selectedIds, setSelectedIds] = useState([])

        
    const summarizeCocktails = (cocktails) => {
        let counts = {}
        cocktails.forEach(cocktail => {
            if (cocktail.ing_percentage === 1){
                counts['green'] = counts['green'] ? counts['green'] + 1 : 1
            } else if (cocktail.ing_percentage > 0.5) {
                counts['yellow'] = counts['yellow'] ? counts['yellow'] + 1 : 1
            } else {
                counts['yellow'] = counts['yellow'] ? counts['yellow'] + 1 : 1
            }
        })
        return counts
    }

    const generateCocktail = (ingredients) => {
        setGenIsLoading(true);
        axios.post('https://vjj6xrqlv1.execute-api.us-west-2.amazonaws.com/production/generate_cocktail', {'ingredients': ingredients})
        //  axios.post('http://127.0.0.1:5000/generate_cocktail', {'ingredients': selectedIds})
            .then(res => {
                var savedResults = res.data.cocktails
                setGenCocktail(savedResults)
                setGenIsLoading(false);
            })
            .catch(err => {
                console.log(err)
                setGenIsLoading(false);
            })
        }


    const getRecommendations = () => {
        axios.post('https://vjj6xrqlv1.execute-api.us-west-2.amazonaws.com/production/recommend_cocktails', {'ingredients': selectedIds})
        // axios.post('http://127.0.0.1:5000/recommend_cocktails', {'ingredients': selectedIds})
            .then(res => {
                var savedResults = res.data.cocktails
                setCocktails(savedResults)
                console.log('cocktails', cocktails)
                setCocktailStats(summarizeCocktails(savedResults))
            })
            .catch(err => {console.log(err)})
        }

    useEffect(() => {
        getRecommendations()
    }, [selectedIds])


    // useEffect(() => {
    //     let currentUrlParams = new URLSearchParams(window.location.search);
    //     currentUrlParams.set('ingredients', selectedIds);
    //     selectedIds.length ? window.history.replaceState(null, null, "/?" + currentUrlParams.toString()) : null;
    // }, [selectedIds])
    
    const toggleIngredient = (objectID, hit) => {
        return () => {
            setGenCocktail([]);
            if (selectedIds.includes(objectID)) {
                setSelectedIds([...selectedIds.slice(0, selectedIds.indexOf(objectID)), ...selectedIds.slice(selectedIds.indexOf(objectID) + 1, selectedIds.length)])
            } else {
                setSelectedIds([...selectedIds, objectID])
                ingredientsCache[objectID] = hit
                setIngredientsCache(ingredientsCache)
            }
        }
    }

    const Hits = ({ hits }) => (
        <div className="flex justify-between flex-wrap align-items-center overflow-scroll">
            {hits.map((hit, ix) => {
                ingredientsCache[hits.objectID] = hit
                let selected = selectedIds.includes(hit.objectID)
                return (
                <div key={hit.objectId + "-hits-" + String(ix)} className={`${selected ? 'hidden' : 'flex'} flex-col bg-white justify-around h-40 sm:h-60 w-[23%] sm:w-[30%] md:w-[22%] lg:w-[15%] rounded-lg shadow-sm p-2 my-3 ease-in duration-1000 hover:ease-out hover:-translate-y-1 hover:shadow-md hover:cursor-pointer hover:ring-0`}
                onClick={toggleIngredient(hit.objectID, hit)}>
                    <img className="h-[60%] object-contain" src={'https://wedgecocktail-ingredient-images.s3-us-west-2.amazonaws.com/' + hit.objectID + '.png'}/>
                    <p className="text-xs sm:text-md leading-1 text-gray-500 text-center align-top">
                        {hit.name}
                    </p>
                </div>
            )})}
        </div>
      );
      
    const CustomHits = connectHits(Hits);
    
  return (
    <div className="flex flex-col justify-center overflow-hidden h-[100vh] max-h-[100vh]">
        <BGGradients/> 
        {/* HEADER COMPONENT */}
        <div className={`ease-out duration-700 ${selectedIds.length ? "text-md pt-5" : "text-[3.5rem] font-bold sm:text-5xl tracking-tight pt-16 sm:pt-20 pb-0"}`}>
            {selectedIds.length ? 
                <div className="flex flex-col justify-center align-middle">
                    <div 
                    className={`z-10 bg-indigo-600 hover:cursor-pointer hover:shadow-lg hover:-translate-y-0.5 flex-col justify-center align-middle absolute top-[2vh] shadow-md duration-150 ${cocktailDrawerOpen ? "drop-shadow-[35px_35px_35px_rgba(0,0,0,0.25)] w-[100%] h-[98vh] rounded-10xl bg-white ease-out right-0 overflow-hidden" : "flex justify-center align-middle w-[90%] sm:w-[30%] sm:left-[35%] bottom-[1vh] top-[93vh] hover:bg-indigo-700 bg-indigo-600 rounded-xl ease-in shadow-xl"}`}>
                        <div                    
                        onClick={() => setCocktailDrawerOpen(!cocktailDrawerOpen)}
                        className={`justify-center transition-none leading-8 tracking-tight text-sm rounded-sm font-bold`}>
                            {cocktailDrawerOpen ? null : 
                            <div className="flex justify-center align-middle">
                                <p className="text-white text-center">SEE COCKTAILS</p>
                                {cocktailStats ? 
                                <div className="flex justify-center align-middle text-center py-1">
                                    {cocktailStats['green'] ? <span className="px-2 py-1 text-xs text-center bg-green-300 text-green-700 rounded-full ml-2">{cocktailStats['green']}</span> : null}
                                    {cocktailStats['yellow'] ? <span className="px-2 py-1 text-xs bg-yellow-300 text-yellow-700 text-center rounded-full ml-2">{cocktailStats['yellow']}+</span> : null}
                                </div> : null
                                }
                            </div>
                            }
                        </div>
                        {cocktailDrawerOpen ?
                        <CocktailDisplay 
                            cocktails={cocktails}
                            generateCocktail={() => generateCocktail(selectedIds)}
                            genCocktail={genCocktail}
                            genIsLoading={genIsLoading}
                            closeCocktailDrawer={() => setCocktailDrawerOpen(!cocktailDrawerOpen)}
                        /> : null}
                    </div>
                    <div className="flex flex-row justify-middle align-start">
                    
                        <span className="my-auto text-xl sm:text-2xl leading-8 text-gray-600 tracking-tight font-normal">Your Pantry</span>
                        <span onClick={() => setSelectedIds([])} className="ml-3 my-auto text-xs text-gray-400 tracking-tight ring-1 ring-gray-100 bg-gray-100 rounded-sm font-bold p-1 px-2 mr-2 shadow-md hover:cursor-pointer hover:shadow-none">clear</span>
                    </div>
                    <div className="flex">
                    {selectedIds.map((sid, ix) => {
                        let hit = ingredientsCache[sid]
                        return hit ? 
                            (
                                <div key={sid + "-pantry-" + String(ix)} onClick={toggleIngredient(hit.objectID, hit)}>
                                    <div className={`relative flex flex-col bg-white justify-around h-[50px] w-[50px] rounded-sm shadow-md p-2 my-3 ml-3 duration-150 ease-in hover:ease-out hover:-translate-y-0.5 hover:shadow-md hover:cursor-pointer`}
                                    >
                                        <img className="h-[80%] object-contain" src={'https://wedgecocktail-ingredient-images.s3-us-west-2.amazonaws.com/' + hit.objectID + '.png'}/>
                                        <div className="absolute top-0 right-1">
                                            <X size={10}/>
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        }  
                        )}
                    </div>
                </div> : <>
                    <h1 className="text-[54px] mb-4 md:text-6xl sm:mb-8 md:text-center leading-tight">What's in <span className="italic">your</span> Pantry?</h1>
                    <p className="md:text-center mb-8 text-xl sm:mb-16 sm:text-2xl leading-8 text-gray-600 tracking-tight font-normal ">???? Select whatever ingredients you have and explore what you can make</p>
                </>}
        </div>
        {/* INGREDIENT SEARCH */}
        <InstantSearch className="overflow-hidden" searchClient={searchClient} indexName="ingredients" >
                <SearchBox
                    className="searchbox py-4 rounded-lg sm:w-[100%] border-gray-300 border-spacing-1 ease-in-out focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
                    showReset={true}
                    translations={{
                        placeholder: 'liquors, fruit, sodas, etc',
                    }}
                />
                <Configure hitsPerPage={60} />
                <div className="overflow-scroll flex-1">
                    <CustomHits />
                    </div>
        </InstantSearch>
    </div>
  )
}

export default IngredientSearch
