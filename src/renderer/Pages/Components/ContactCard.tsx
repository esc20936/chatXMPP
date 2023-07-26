import React from 'react'

export default function ContactCard() {
  return (
    <div className='h-16 w-full flex flex-row hover:bg-focusMainColor'>
        {/* avatar */}
        <div className='h-full w-1/6 flex flex-col justify-center items-center '>
            <div className='h-10 w-10 rounded-full justify-center items-center bg-purple-600'>
                <h1 className='text-white text-lg font-bold text-center mt-1'>JD</h1>
            </div>
        </div>
        {/* info */}
        <div className='h-full w-5/6 flex flex-col justify-center items-start p-2'>
            <h1 className='text-white text-lg font-bold'>John Doe</h1>
            <p className='text-white/50 text-xs'>Hey, how are you?</p>
        </div>

    </div>
  )
}
