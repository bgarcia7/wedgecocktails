import Head from 'next/head'
import Image from 'next/image'
import { Home, Navbar }  from '../components'
import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Main() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"/>
      </Head>
      <main>
        <Navbar/>
        <Home/>
        <div className="w-full px-10 h-[400px] flex align-items-center justify-center">
          TESTING
        </div>
      </main>
    </>
  )
}
