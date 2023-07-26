import React from 'react'
import ContactCard from './ContactCard'
import { useNavigate } from 'react-router-dom'

export default function Contacts() {
    const navigate = useNavigate()

    const handleLogOut = () => {
        navigate('/')
    }
  return (
    <div className='h-full w-full flex flex-col justify-start items-start p-2'>
        {/* search input */}
        <div className='h-screen-2/16 w-full flex flex-col items-center justify-center'>
            <input className='w-11/12 h-10 rounded-lg bg-focusMainColor text-white px-4 focus:ring-0 focus:outline-none' placeholder='Search' />
        </div>

        {/* contacts */}
        <div className='h-screen-12/16 w-full flex flex-col items-center justify-start overflow-y-scroll px-2'>
            {
                [...Array(50)].map((e, i) => {
                    return <ContactCard key={i} />
                }
                )
            }
        </div>

        {/* log out */}
        <div className='h-screen-2/16 w-full flex flex-col items-center justify-center'>
            <button className='w-11/12 h-10 rounded-lg text-white px-4 focus:ring-0 focus:outline-none
            hover:bg-red-500 transition duration-300 ease-in-out
            '
            onClick={handleLogOut}
            >Log out</button>    
        </div>

    </div>
  )
}
