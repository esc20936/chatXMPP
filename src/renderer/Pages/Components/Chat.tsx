import React from 'react'

export default function Chat() {
  return (
    <main className='h-full w-full flex flex-col justify-start center'>
        
        {/* header */}
        <div className='flex flex-row justify-start items-center w-full h-screen-2/16'>

            {/* chat info */}
            <div className='flex flex-col justify-start items-start w-3/4 h-full p-6'>
                <h1 className='text-lg font-bold text-white'>Office chat</h1>
                <p className='text-white/50 text-xs'>45 members, 24 online</p>
            </div>

        </div>

        {/* chat */}
        <div className='flex flex-col justify-start items-start w-full h-screen-12/16  overflow-y-scroll'>
            
        </div>

        {/* input */}
        <div className='flex flex-row justify-start items-center w-full h-screen-2/16 bg-mainColor/90 px-8'>
            <input className='w-11/12 h-10 rounded-lg bg-focusMainColor text-white px-4 focus:ring-0 focus:outline-none ml-4' placeholder='Message' />
            <button className='w-1/12 h-10 rounded-lg bg-accentColor text-white px-4 ml-4 focus:ring-0 focus:outline-none
            hover:bg-hoverAccentColor transition duration-300 ease-in-out
            '>Send</button>
        </div>



    </main>
  )
}
