/* This example requires Tailwind CSS v3.0+ */
import { strings } from '../constants'
import { BGGradients, PrimaryButton, IngredientSearch } from './'
import { styles } from '../styles'

export default function Home({ initialData }) {
  return (
    <div className="max-w-[100vw] max-h-100vh isolate bg-white">
        <div className={`${styles.xPadding} w-[100vw]`}>
          <IngredientSearch initialData={initialData}/>
        </div>
    </div>
  )
}
