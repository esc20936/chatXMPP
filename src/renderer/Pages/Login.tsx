import React from 'react'
import discordImage from '../../../assets/discord.svg';

export default function Login() {
  return (
    <main className='h-full w-full bg-darkColor flex flex-col justify-center items-center p-12'>
        <div className='flex flex-row h-4/5 w-8/12 bg-mainColor rounded-lg'>
            {/* left side */}
            <div className='flex flex-col justify-end items-end bg-discordPurple/60 h-full w-1/2 rounded-l-lg'>
                <img src={discordImage} alt='discord' className='' />
            </div>
            {/* right side */}
            <div className='flex flex-col justify-center items-start w-1/2 p-4  rounded-lg shadow-lg'>
                <h1 className='text-4xl font-bold text-white mb-8'>Login</h1>
                <input className='w-full h-12 rounded-lg bg-focusMainColor text-white px-4 focus:ring-0 focus:outline-none' placeholder='Username' />
                <input className='w-full h-12 rounded-lg bg-focusMainColor text-white px-4 mt-4 focus:ring-0 focus:outline-none' placeholder='Password' type='password' />
                <button className='w-full h-12 rounded-lg bg-accentColor text-white px-4 mt-8 
                hover:bg-hoverAccentColor transition duration-300 ease-in-out
                '>Login</button>

                {/* create account */}
                <div className='flex flex-row justify-center items-center mt-8'>
                    <p className='text-white/50'>Don't have an account?</p>
                    <button className='text-white ml-2
                    hover:text-hoverAccentColor transition duration-300 ease-in-out
                    '>Create one</button>
                    </div>
            </div>
        </div>
    </main>
  )
}
