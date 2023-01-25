/* This example requires Tailwind CSS v3.0+ */
import { strings } from '../constants'
import { BGGradients, PrimaryButton, IngredientSearch } from './'
import { styles } from '../styles'

export default function Home({ initialData }) {
  return (
    <div className="max-w-[100vw] isolate bg-white">
        <div className={`${styles.xPadding} relative`}>
          <div className={`max-w-3xl pt-40 ${styles.yPadding} pb-0`}>
            <div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                  What's in <span className="italic">your</span> Pantry?
                  
                  {/* {strings.home.h1} */}
                </h1>
                <p className="mt-6 text-xl sm:text-2xl leading-8 text-gray-600">
                  Make great cocktails with whatever's on-hand. 
                </p>
              </div>
              <BGGradients/>
            </div>
          </div>
          <IngredientSearch initialData={initialData}/>
        </div>
    </div>
  )
}
