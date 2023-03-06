import { React, useState } from 'react'
import PrimaryButton from './'
import { styles } from '../styles'
import CocktailList from './CocktailList'
import CocktailPage from './CocktailPage'
import { X } from 'react-feather'

const CocktailDisplay = ({ cocktails, generateCocktail, genCocktail, closeCocktailDrawer}) => {
    let [activeCocktailID, setActiveCocktailID] = useState(null)

    return (
        <div className={`${styles.xPadding} flex flex-col overflow:hidden h-[100%] align-middle`}>
            <div className="flex justify-end mt-3">
                <X 
                    onClick={activeCocktailID ? () => setActiveCocktailID(null) : closeCocktailDrawer} 
                    size={20}
                />
            </div>
            {activeCocktailID ? 
                <CocktailPage
                    cocktail={cocktails.find(x => x.objectID === activeCocktailID)}
                /> : 
                <CocktailList
                    cocktails={cocktails}
                    generateCocktail={generateCocktail}
                    getCocktail={genCocktail}
                    setActiveCocktailID={setActiveCocktailID}
                />
            }
        </div>
    )
}

export default CocktailDisplay

