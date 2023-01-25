import React from 'react'


function PrimaryButton({text, onClick, link, color="primary"}) {
  const buttonColor = {
    primary: "text-white ring-indigo-600 hover:bg-indigo-700 bg-indigo-600",
    secondary: "text-gray-900 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
  }[color] 
  return (
    <a
        href={link}
        className={`inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 shadow-sm ring-1 hover:cursor-pointer ${buttonColor}`}
        onClick={onClick}
        >
        {text}{' '}
        <span className="text-gray-400" aria-hidden="true">
            &rarr;
        </span>
    </a>
  )
}

export default PrimaryButton