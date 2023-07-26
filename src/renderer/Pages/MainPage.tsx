import React from 'react'
import Chat from './Components/Chat'
import Contacts from './Components/Contacts'

export default function MainPage() {
  return (
    <main className='h-full w-full bg-mainColor/90 flex flex-row'>
        {/* contacts */}
        <div className='flex flex-col justify-start items-start w-1/5 h-full '>
            <Contacts />
        </div>
        {/* chat */}
        <div className='flex flex-col justify-start items-start w-3/5 h-full bg-mainColor rounded-lg'>
            <Chat />
        </div>
        {/* user */}
        <div className='flex flex-col justify-start items-start w-1/5 h-full'>

        </div>

    </main>
  )
}
