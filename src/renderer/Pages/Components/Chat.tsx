import React from 'react'

export default function Chat() {
  return (
    <main className='flex flex-col justify-start w-full h-full center'>
        
        {/* header */}
        <div className='flex flex-row items-center justify-start w-full h-screen-2/16'>

            {/* chat info */}
            <div className='flex flex-col items-start justify-start w-3/4 h-full p-6'>
                <h1 className='text-lg font-bold text-white'>Office chat</h1>
                <p className='text-xs text-white/50'>45 members, 24 online</p>
            </div>

        </div>

        {/* chat */}
        <div className='flex flex-col items-start justify-start w-full overflow-y-scroll h-screen-12/16'>
            
        </div>

        {/* input */}
        <div className='flex flex-row items-center justify-center w-full px-8 h-screen-2/16 bg-mainColor/90'>
            <input className='w-8/12 h-10 px-4 ml-4 text-white rounded-lg bg-focusMainColor focus:ring-0 focus:outline-none' placeholder='Message' />
            <button className='w-3/12 h-10 px-4 ml-4 text-white transition duration-300 ease-in-out rounded-lg bg-accentColor focus:ring-0 focus:outline-none hover:bg-hoverAccentColor '>Send</button>
        </div>



    </main>
  )
}
