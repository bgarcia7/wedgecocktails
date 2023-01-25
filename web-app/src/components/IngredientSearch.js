import { React, useEffect, useState, useRef } from 'react'
import { PrimaryButton } from './'
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
import { SnapList, SnapItem, useScroll, useDragToScroll } from 'react-snaplist-carousel'
import { LinearGradient } from 'linear-gradient'
import { styles } from '@/styles';
const searchClient = algoliasearch(
'XDZGBI1FCU',
'accb47948bbc928311f5b97d9c18ea5a'
);
// const index = searchClient.initIndex('ingredients');

export var results = [];

const IngredientSearch = () => {
    const [ingredientsCache, setIngredientsCache] = useState({})
    const [selectedIds, setSelectedIds] = useState([])
    // const history = useHistory

    const getRecommendations = () => {
        axios.post('https://vjj6xrqlv1.execute-api.us-west-2.amazonaws.com/production/recommend_cocktails', {'ingredients': selectedIds})
            .then(res => {
                var savedResults = res.data.cocktails
                setData(savedResults)
            })
            .catch(err => {console.log(err)})
        }

    useEffect(() => {
        getRecommendations()
        console.log(data)
    }, [selectedIds])

    useEffect(() => {
        if (window.location.search.includes('?ingredients=')){
            // index.findObject({objectID: window.location.search.split('?ingredients=')[1]}).then(({ object }) => {
            let ingredients = window.location.search.split('?ingredients=')
            ingredients.length ? setSelectedIds(ingredients[1].split("%2C")) : null
        }
    }, [])

    useEffect(() => {
        let currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set('ingredients', selectedIds);
        selectedIds.length ? window.history.replaceState(null, null, "/?" + currentUrlParams.toString()) : null;
    }, [selectedIds])
    
    const toggleIngredient = (objectID, hit) => {
        return () => {
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
        <div className="flex justify-between flex-wrap align-items-center overflow-scroll min-h-[50vh]">
            {hits.map((hit, ix) => {
                ingredientsCache[hits.objectID] = hit
                return (
                <div key={hit.objectId + "-hits-" + String(ix)} className={`flex flex-col bg-white justify-around h-40 sm:h-60 w-[45%] sm:w-[30%] md:w-[22%] lg:w-[15%] rounded-lg shadow-sm p-2 my-3 duration-150 ease-in hover:ease-out hover:-translate-y-0.5 hover:shadow-md hover:cursor-pointer ${selectedIds.includes(hit.objectID) ? "opacity-20 hover:opacity-40" : "opacity-100 hover:opacity-100"}`}
                onClick={toggleIngredient(hit.objectID, hit)}>
                    <img className="h-[60%] object-contain" src={'https://wedgecocktail-ingredient-images.s3-us-west-2.amazonaws.com/' + hit.objectID + '.png'}/>
                    <p className="text-m sm:text-l leading-6 text-gray-500 text-center">
                        {hit.name}
                    </p>
                </div>
            )})}
        </div>
      );
      
    const CustomHits = connectHits(Hits);
      
    // RECOMMENDATIONS LOGIC 
    let [data, setData] = useState([])

function arrayToString(array) {
    var string = '';
    for (var i = 0; i < array.length; i++) {
        string += array[i].quantity + ' of ' + array[i].name + ' • ';
    }
    return string.slice(0, -2);
}

    const snapList = useRef(null);
    const lastSnapItem = useRef(null);
    const goToSnapItem = useScroll({ ref: snapList });
    const { isDragging } = useDragToScroll({ ref: snapList, disable: false });
    
  return (
    <div className="max-w-full">
        <div> 
            { data.length ? 
            <SnapList ref={snapList} tabIndex={0} className="mt-10">
            {data.map((cocktail, ix) => (
            <SnapItem key={cocktail.id + "-recommendation-" + String(ix)} className="flex flex-col align-middle justify-top overflow-hidden bg-white h-[62vh] ring-1 ring-gray-100 rounded-lg shadow-lg w-[70%] sm:w-[25%] mt-1 mb-1 mr-2 ml-1 p-4 sm:mr-10 sm:p-8 rounded-lg shadow-sm duration-150 ease-in hover:ease-out hover:-translate-y-0.5 hover:shadow-md hover:cursor-pointer ">
            {/* <div className="ring-1 bg-white rounded-l min-[45%] sm:w-[20%]"> */}
                  <div className="text-clip text-ellipsis flex flex-col align-center">
                        <div className="">
                            <img className="h-[20vh] m-auto" src={cocktail.image_url}/>
                        </div>
                            <p>{cocktail.name}</p>
                        <p className="text-sm">
                            {arrayToString(cocktail.ingredients)}
                        </p>
                        <p className="text-sm">
                            {cocktail.serving_container}
                        </p>
                        {/* PERCENT OF INGREDIENT HITS AND INSTRUCTIONS */}
                            {/* <p margin="10px 0px 0px 0px;">{String(cocktail.ing_percentage * 100) + '% of ingredients available'}</p> */}
                        <div className="w-[33%]">
                            <h2>Directions</h2>
                            <p margin="10px 0px; ">{cocktail.instructions}</p>
                        </div>
                    </div>
            {/* </div> */}

            </SnapItem>))}

            </SnapList> :

        <div className="flex flex-row mt-10">
            {['','',''].map((cocktail, ix) => (
            <div key={'gray-holder' + String(ix)} className="flex flex-col align-middle justify-top overflow-hidden bg-[#fdfdfd] h-[32vh] ring-1 ring-gray-100 rounded-lg shadow-lg w-[70%] sm:w-[25%] mt-1 mb-1 mr-2 ml-1 p-4 sm:mr-10 sm:p-8 rounded-lg shadow-sm duration-150 ease-in hover:ease-out hover:-translate-y-0.5 hover:shadow-md hover:cursor-pointer ">
            </div>))}

        </div>}
        </div>
        {/* <PrimaryButton onClick={getRecommendations} text="See Results"/> */}

        <div className={`ease-out duration-700 ${selectedIds.length ? "text-md pt-10" : "text-4xl font-bold sm:text-5xl tracking-tight pt-40 pb-20"}`}>
            {selectedIds.length ? 
                <div className="flex flex-col flex-0 justify-start align-middle">
                 <span className="my-auto mt-6 text-xl sm:text-2xl leading-8 text-gray-600 tracking-tight font-normal">Your Pantry</span>
                 <div className="flex">
                 {selectedIds.map((sid, ix) => {
                    let hit = ingredientsCache[sid]
                    return hit ? 
                        (
                            <div key={sid + "-pantry-" + String(ix)} onClick={toggleIngredient(hit.objectID, hit)}>
                            <div className={`flex flex-col bg-white justify-around h-[50px] w-[50px] rounded-sm shadow-md p-2 my-3 ml-3 duration-150 ease-in hover:ease-out hover:-translate-y-0.5 hover:shadow-md hover:cursor-pointer`}
                            >
                                <img className="h-[80%] object-contain" src={'https://cocktail-ingredient-images.s3-us-west-2.amazonaws.com/' + hit.objectID + '.png'}/>
                            </div>
                            </div>
                        ) : null
                 }
            )}

                 </div>
                </div>
                 : 
                <>
                    <h1>What do you have?</h1>
                    <p className="mt-6 text-xl sm:text-2xl leading-8 text-gray-600 tracking-tight font-normal ">Select whatever ingredients you have and explore what you can make.</p>
                </>
            }</div>
        <InstantSearch  searchClient={searchClient} indexName="ingredients" >
            <div className="search-panel__results">
                {/* <ScrollTo> */}
                
                <SearchBox
                    className="searchbox px-2 py-4 rounded-lg sm:w-[100%] border-gray-300 border-spacing-1 ease-in-out focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    showReset={true}
                    translations={{
                        placeholder: '',
                    }}
                />
                
                {/* </ScrollTo> */}
                
                <Configure hitsPerPage={210} />
                <CustomHits />
            </div>
        </InstantSearch>
    </div>
  )
}

export default IngredientSearch