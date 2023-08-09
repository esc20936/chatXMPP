import React from 'react'

export default function ContactCard() {
  return (
    <div className='flex flex-row w-full h-16 transition duration-300 ease-in-out hover:bg-focusMainColor '>
        {/* avatar */}
        <div className='flex flex-col items-center justify-center w-1/6 h-full ml-2 '>
            <div className='flex flex-col items-center justify-center w-10 h-10 bg-purple-600 rounded-full'>
                <h1 className='font-bold text-center text-white text-md'>JD</h1>
            </div>
        </div>
        {/* info */}
        <div className='flex flex-col items-start justify-center w-4/6 h-full p-2 ml-2'>
            <h1 className='font-bold text-white text-sm-'>John Doe</h1>
            <p className='text-xs text-white/50'>Hey, how are you?</p>
        </div>

    </div>
  )
}
